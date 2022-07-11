// TITLE: TestingContext
// Created by (Varun: Varun-Sethu) (09/21)
// Last modified by (Varun: Varun-Sethu) (1/10/21)
// # # #
/*
	File defines the TestingContext, that is the context used to interact with the testing database(s)
	also defines methods for carrying out and performing tests against a testing database such that
	they can upgrades can easilly be rolled back without leaking to other unit tests. Also an implementation
	of the DatabaseContext interface
**/
package contexts

import (
	"context"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

// @implements database context
type TestingContext struct {
	conn *pgxpool.Pool

	inTransactionMode bool
	activeTransaction pgx.Tx
}

// newTestingContext initialises a new database for testing
func newTestingContext() *TestingContext {
	backingConnection := getTestDatabase()
	return &TestingContext{
		conn:              backingConnection,
		inTransactionMode: false,
		activeTransaction: nil,
	}
}

// Implementation of regular DatabaseContext methods
func (ctx *TestingContext) Query(query string, sqlArgs []interface{}, resultOutput ...interface{}) error {
	ctx.verifyEnvironment()
	return ctx.activeTransaction.QueryRow(context.Background(), query, sqlArgs...).Scan(resultOutput...)
}

func (ctx *TestingContext) QueryRow(query string, sqlArgs []interface{}) (pgx.Rows, error) {
	ctx.verifyEnvironment()
	return ctx.activeTransaction.Query(context.Background(), query, sqlArgs...)

}

func (ctx *TestingContext) Exec(query string, sqlArgs []interface{}) error {
	ctx.verifyEnvironment()
	_, err := ctx.activeTransaction.Exec(context.Background(), query, sqlArgs...)
	return err
}

func (context *TestingContext) Close() {
	context.conn.Close()
}

// Additional functions attached to a testing context (to actually make it useful ;) )

// RunTest sets up a new testing environment on the testing context (creates a transaction),
// it then performs the given test method and finally rolls back any updates it had made
func (ctx *TestingContext) RunTest(methodToTest func()) {

	if testingTransaction, err := ctx.conn.Begin(context.Background()); err == nil {

		ctx.startTestMode(testingTransaction)
		methodToTest()
		ctx.stopTestMode()

		// rollback updates
		err = testingTransaction.Rollback(context.Background())
		if err != nil {
			panic(err)
		}

	} else {
		panic(err)
	}
}

// WillFail wraps around a function that expects to fail,
// if it does fail it returns true otherwise false, note that an active transaction
// must be setup to use this method, that is it can only be called within a RunTest invocation
func (ctx *TestingContext) WillFail(testMethod func() error) bool {
	ctx.verifyEnvironment()

	if nestedTransaction, err := ctx.activeTransaction.Begin(context.Background()); err == nil {

		oldTransaction := ctx.activeTransaction

		// start a new testing mode with the nested transaction
		ctx.startTestMode(nestedTransaction)
		err = testMethod()
		ctx.startTestMode(oldTransaction)

		// rollback the updates
		if nestedTransaction.Rollback(context.Background()) != nil {
			panic(err)
		}

		return err != nil
	} else {
		panic(err)
	}
}

// verifyEnvironment just checks that the current testing context
// can actually touch the DB, if not it panics :(
func (ctx *TestingContext) verifyEnvironment() {
	if !ctx.inTransactionMode || ctx.activeTransaction == nil {
		panic("cannot perform queries outside of 'RunTest'")
	}
}

// startTestMode just sets the underlying transaction to a context
func (ctx *TestingContext) startTestMode(t pgx.Tx) {
	ctx.activeTransaction = t
	ctx.inTransactionMode = true
}

// stopTestMode removes the underlying transaction for a context
func (ctx *TestingContext) stopTestMode() {
	ctx.activeTransaction = nil
	ctx.inTransactionMode = false
}
