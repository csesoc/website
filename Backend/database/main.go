// TITLE: Database
// Created by (Varun: Varun-Sethu) (09/21)
// Last modified by (Varun: Varun-Sethu) (1/10/21)
// # # #
/*
	This package defines utilities and helper functions for dealing with the database(s)
	it defines testing and live contexts to perform operations against a database and
	run datbase bound unit tests.
**/
package database

// DatabaseContext exposes 3 methods to the user, by using an interface
// it allows us to easilly swap what context (and consequently database) a method is actually using.
// Any connection to the database implements the database context interface
type DatabaseContext interface {
	Query(query string, sqlArgs []interface{}, resultOutput ...interface{}) error
	Exec(query string, sqlArgs []interface{}) error
	Close()
}

// Config is a structure that just outlines
// connection details for the database
type Config struct {
	HostAndPort string
	User        string
	Password    string
	Database    string
}

// Constants regarding database connections
// TODO: eventually Jacky will abstract this out to docker environment variables
const USER = "postgres"
const PASSWORD = "postgres"
const DATABASE = "test_db"
const HOST_AND_PORT = "db:5432"

const TEST_USER = "postgres"
const TEST_PASSWORD = "test"
const TESTING_DB_NAME = "cms_testing_db"

const TEST_DB_EXPIRY_TIME = 180
