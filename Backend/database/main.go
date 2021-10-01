package database

// Database defines utilities and helper functions for dealing with the database(s)

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
