// TITLE: DB Fetcher
// Created by (Varun: Varun-Sethu) (09/21)
// Last modified by (Varun: Varun-Sethu) (1/10/21)
// # # #
/*
	This file is involved with fetching/spinning up databases to host unit tests
	on our docker test instance
**/
package contexts

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	lls "github.com/emirpasic/gods/stacks/linkedliststack"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/ory/dockertest"
	"github.com/ory/dockertest/docker"
)

// File contains methods and global variables related to fetching
// and creating test database instances

// candidateTestHosts maintains a stack of potential testing databases to connect to
var candidateTestHosts *lls.Stack

func init() {
	// Initialise candidate databases
	candidateTestHosts = lls.New()
	candidateTestHosts.Push("staging_db:1234")
	candidateTestHosts.Push("localhost:1234")
}

// getTestDatbase retrieves a connection to a test database based on
// the contents of candidateTestHosts, note that if candidateTestHosts
// is empty or all the hosts are no longer avaliable a test database is spun
// up in a new docker container, this container expires after 3 minutes of
// inactivity, method encapsulates all errors as the function will only be called
// in a testing environment; where panics are completely acceptible :)
func getTestDatabase() *pgxpool.Pool {
	// Find a host run our tests on
	for !candidateTestHosts.Empty() {
		potentialHost, _ := candidateTestHosts.Peek()
		if ctx, err := tryConnect(potentialHost.(string)); err == nil {
			return ctx
		}
		// host was garbage, delete them
		candidateTestHosts.Pop()
	}

	// Once all hosts have been exhausted just spin up a new DB and try again
	newDB := createNewTestDB()
	ctx, err := tryConnect(newDB)
	if err != nil {
		panic("failed to attain a test database")

	}

	candidateTestHosts.Push(newDB)
	return ctx
}

// tryConnect attempts to connect to a testingDatabase given its host string, if
// it fails to connect to the database it just throws an error; otherwise it throws
// back a connection
func tryConnect(host string) (*pgxpool.Pool, error) {
	conn, err := pgxpool.Connect(context.Background(),
		fmt.Sprintf("postgres://%s:%s@%s/%s", TEST_USER, TEST_PASSWORD, host, TESTING_DB_NAME))
	if err == nil {
		// looks like we could connect
		return conn, nil
	}
	return nil, err
}

// createNewTestDB creates a new instance of the testing database and returns the host details
// the schema underlying the test database is read directly from the postgres create_tables.sql file
// the testing database is spun up as a docker container with a 3 minute expiry due to inactivity
func createNewTestDB() string {
	pool, resource := createDatabaseContainer()

	hostAndPort := resource.GetHostPort("5432/tcp")
	databaseURL := fmt.Sprintf("postgres://%s:%s@%s/%s", TEST_USER, TEST_PASSWORD, hostAndPort, TESTING_DB_NAME)
	db := verifyConnection(pool, databaseURL)

	startupScript, err := importSchema()
	if err != nil {
		panic(err)
	}

	db.Query(startupScript)
	db.Close()

	return hostAndPort
}

// createDockerDatabase resource creates a docker container to host
// the test database, prior to any othe work being done
func createDatabaseContainer() (*dockertest.Pool, *dockertest.Resource) {
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

	resource.Expire(TEST_DB_EXPIRY_TIME)
	pool.MaxWait = TEST_DB_EXPIRY_TIME * time.Second

	return pool, resource
}

// verifyConnection attempts to check that database conneciton
// was actually established using an exponential backoff procedure
// if we manage to connect it returns the db connection
func verifyConnection(pool *dockertest.Pool, databaseURL string) *sql.DB {
	var db *sql.DB

	if err := pool.Retry(func() error {
		db, err := sql.Open("postgres", databaseURL)
		if err != nil {
			return err
		}
		return db.Ping()
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}
	return db
}
