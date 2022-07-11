// TITLE: LiveContext
// Created by (Varun: Varun-Sethu) (09/21)
// Last modified by (Varun: Varun-Sethu) (1/10/21)
// # # #
/*
	File defines the LiveContext, that is the context used to interact with the live database, serves as an implementation of
	the DatabaseContext interface
**/
package contexts

import (
	"context"
	"errors"
	"fmt"
	"log"

	"cms.csesoc.unsw.edu.au/environment"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

// @implements DatabaseContext
type liveContext struct {
	conn *pgxpool.Pool
}

// NewPool returns a new pool from a given configuration
func newLiveContext() (*liveContext, error) {
	conn, err := pgxpool.Connect(context.Background(),
		fmt.Sprintf("postgres://%s:%s@%s/%s", USER, PASSWORD, HOST, DATABASE))

	log.Print("== Acquired live DB context == ")
	if err != nil {
		return nil, errors.New("unable to connect to the database")
	}

	return &liveContext{
		conn,
	}, nil
}

// Regular DatabaseContext methods
func (ctx *liveContext) Query(query string, sqlArgs []interface{}, resultOutput ...interface{}) error {
	ctx.verifyEnvironment()
	return ctx.conn.QueryRow(context.Background(), query, sqlArgs...).Scan(resultOutput...)
}

func (ctx *liveContext) QueryRow(query string, sqlArgs []interface{}) (pgx.Rows, error) {
	ctx.verifyEnvironment()
	return ctx.conn.Query(context.Background(), query, sqlArgs...)
}

func (ctx *liveContext) Exec(query string, sqlArgs []interface{}) error {
	ctx.verifyEnvironment()
	_, err := ctx.conn.Exec(context.Background(), query, sqlArgs...)
	return err
}

func (context *liveContext) Close() {
	context.conn.Close()
}

// verifyEnvironment just verifies that our current execution environment is fit for a live context
// if not it panics
func (ctx *liveContext) verifyEnvironment() {
	if environment.IsTestingEnvironment() {
		panic("do not query a LiveContext DB from a test")
	}
}
