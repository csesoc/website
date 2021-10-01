package database

// File defines the LiveContext, that is the context used to interact with the live database

import (
	"DiffSync/environment"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v4/pgxpool"
)

// @implements DatabaseContext
type LiveContext struct {
	conn *pgxpool.Pool
}

// NewPool returns a new pool from a given configuration
func NewLiveContext() (LiveContext, error) {
	conn, err := pgxpool.Connect(context.Background(),
		fmt.Sprintf("postgres://%s:%s@%s/%s", USER, PASSWORD, HOST_AND_PORT, DATABASE))
	if err != nil {
		return LiveContext{}, errors.New("unable to connect to the database")
	}

	return LiveContext{
		conn,
	}, nil
}

// Regular DatabaseContext methods
func (ctx LiveContext) Query(query string, sqlArgs []interface{}, resultOutput ...interface{}) error {
	ctx.verifyEnvironment()
	return ctx.conn.QueryRow(context.Background(), query, sqlArgs...).Scan(resultOutput...)
}

func (ctx LiveContext) Exec(query string, sqlArgs []interface{}) error {
	ctx.verifyEnvironment()
	_, err := ctx.conn.Exec(context.Background(), query, sqlArgs...)
	return err
}

func (context LiveContext) Close() {
	context.conn.Close()
}

// verifyEnvironment just verifies that our current execution environment is fit for a live context
// if not it panics
func (ctx LiveContext) verifyEnvironment() {
	if environment.IsTestingEnvironment() {
		panic("do not query a LiveContext DB from a test")
	}
}
