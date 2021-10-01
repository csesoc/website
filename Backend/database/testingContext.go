package database

// File defines the TestingContext, that is the context used to interact with the testing database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	lls "github.com/emirpasic/gods/stacks/linkedliststack"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/ory/dockertest"
	"github.com/ory/dockertest/docker"
)

// candidateHosts maintains a stack of potential testing databases to connect to
var candidateHosts *lls.Stack

func init() {
	candidateHosts = lls.New()
	candidateHosts.Push("staging_db:1234")
	candidateHosts.Push("localhost:1234")
}

// @implements database context
type TestingContext struct {
	conn *pgxpool.Pool

	inTransactionMode bool
	activeTransaction pgx.Tx
}

// NewTestingContext initialises a new database for testing
func NewTestingContext() TestingContext {

	// Attempts to establish a context given a host
	tryConnect := func(host string) (TestingContext, error) {
		conn, err := pgxpool.Connect(context.Background(),
			fmt.Sprintf("postgres://%s:%s@%s/%s", TEST_USER, TEST_PASSWORD, host, TESTING_DB_NAME))
		if err == nil {
			// looks like we could connect
			return TestingContext{
				conn:              conn,
				inTransactionMode: false,
			}, nil
		}
		return TestingContext{}, err
	}

	// Find a host run our tests on
	for !candidateHosts.Empty() {
		potentialHost, _ := candidateHosts.Peek()
		if ctx, err := tryConnect(potentialHost.(string)); err == nil {
			return ctx
		}
		// host was garbage, delete them
		candidateHosts.Pop()
	}

	// Once all hosts have been exhausted just spin up a new DB and try again
	newDB := spinTestDB()
	ctx, err := tryConnect(newDB)
	if err == nil {
		candidateHosts.Push(newDB)
		return ctx
	} else {
		panic("something went horribly wrong and now ur tests have failed :P")
	}
}

// Implementation of regular DatabaseContext methods
func (ctx TestingContext) Query(query string, sqlArgs []interface{}, resultOutput ...interface{}) error {
	if !ctx.inTransactionMode {
		panic("cannot perform database ops on a testing DB unless in transaction mode")
	}
	return ctx.activeTransaction.QueryRow(context.Background(), query, sqlArgs...).Scan(resultOutput...)
}

func (ctx TestingContext) Exec(query string, sqlArgs []interface{}) error {
	if !ctx.inTransactionMode {
		panic("cannot perform database ops on a testing DB unless in transaction mode")
	}
	_, err := ctx.activeTransaction.Exec(context.Background(), query, sqlArgs...)
	return err
}

func (context TestingContext) Close() {
	context.conn.Close()
}

// Note: All database tests are performed by a test runner, this runner wraps around the test method encasing all its operations in a transaction
// once the test is complete the transaction is rolled back
func (ctx *TestingContext) RunTest(testMethod func()) {
	testingTransaction, err := ctx.conn.Begin(context.Background())
	if err != nil {
		panic(err)
	}

	ctx.activeTransaction = testingTransaction
	ctx.inTransactionMode = true
	testMethod()

	// cleanup after the test has been performed
	err = testingTransaction.Rollback(context.Background())
	if err != nil {
		panic(err)
	}
	ctx.inTransactionMode = false
	ctx.activeTransaction = nil
}

// WillFail wraps around a function that expects to fail,
// if it does fail it returns true otherwise false, note that an active transaction
// must be setup to use this method, that is it can only be called within a RunTest invocation
func (ctx *TestingContext) WillFail(testMethod func() error) bool {
	if !ctx.inTransactionMode {
		panic("cannot call WillFail without an active transaction")
	}

	nestedTransaction, err := ctx.activeTransaction.Begin(context.Background())
	if err != nil {
		panic("WillFail invocation failed iNcOrReCtLy :P")
	}
	// swap out the transaction context being used
	temp := ctx.activeTransaction
	ctx.activeTransaction = nestedTransaction
	err = testMethod()
	ctx.activeTransaction = temp

	if nestedTransaction.Rollback(context.Background()) != nil {
		panic(err)
	}

	return err != nil
}

// spinTestDB creates a new instance of the testing database and returns the host details
// the schema is dicated by the provided schema script :)
func spinTestDB() string {
	var db *sql.DB

	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	// pulls an image, creates a container based on it and runs it
	resource, err := pool.RunWithOptions(&dockertest.RunOptions{
		Repository: "postgres",
		Tag:        "11",
		Env: []string{
			"POSTGRES_PASSWORD=test",
			"POSTGRES_USER=postgres",
			"POSTGRES_DB=cms_testing_db",
			"listen_addresses = '*'",
		},
	}, func(config *docker.HostConfig) {
		// set AutoRemove to true so that stopped container goes away by itself
		config.AutoRemove = true
		config.RestartPolicy = docker.RestartPolicy{Name: "no"}
	})
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}

	hostAndPort := resource.GetHostPort("5432/tcp")
	databaseUrl := fmt.Sprintf("postgres://postgres:test@%s/cms_testing_db?sslmode=disable", hostAndPort)

	resource.Expire(180)
	pool.MaxWait = 120 * time.Second
	if err = pool.Retry(func() error {
		db, err = sql.Open("postgres", databaseUrl)
		if err != nil {
			return err
		}
		return db.Ping()
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	startupScript, err := importSchema()
	if err != nil {
		panic(err)
	}

	_, err = db.Query(startupScript)
	if err != nil {
		panic(err)
	}
	err = db.Close()
	if err != nil {
		panic(err)
	}

	return hostAndPort
}
