package database

import (
	"context"
	"errors"
	"fmt"
	"reflect"

	"github.com/jackc/pgx/v4/pgxpool"
)

// Defines utilities and helper functions for dealing with the database
// pool contains a database connection pool, note that the pool is managed
// by pgx's connection structrure

// The actual pool structure
type Pool struct {
	config Config
	conn   *pgxpool.Pool
}

// Config is a structure that just outlines
// connection details for the database
type Config struct {
	HostAndPort string
	User        string
	Password    string
	Database    string
}

// NewPool returns a new pool from a given configuration
func NewPool(conf Config) (Pool, error) {
	configFields := reflect.ValueOf(conf)
	for i := 0; i < reflect.TypeOf(conf).NumField(); i++ {
		if configFields.Field(i) == reflect.ValueOf("") {
			return Pool{}, errors.New("all fields in config struct must be filled")
		}
	}

	conn, err := pgxpool.Connect(context.Background(),
		fmt.Sprintf("postgres://%s:%s@%s/%s", conf.User, conf.Password, conf.HostAndPort, conf.Database))
	if err != nil {
		return Pool{}, errors.New("unable to connect to the database")
	}

	return Pool{
		conf,
		conn,
	}, nil
}

// Query: this is generally bad, output is expected to be a pointer
func (pool Pool) GetConn() *pgxpool.Pool {
	return pool.conn
}

// ClosePool terminates a connection pool
func (pool Pool) Close() {
	pool.conn.Close()
	pool.conn = nil
}
