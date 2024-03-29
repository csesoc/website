package repositories

import (
	"cms.csesoc.unsw.edu.au/database/contexts"
	"cms.csesoc.unsw.edu.au/environment"
)

// User groups configurations
const (
	GROUPS_ADMIN int = 1
	GROUPS_USER  int = 2
)

// internal ID for holding potentially null
// foreign keys
// implements scannable interface
type nullableID struct {
	ID *int
}

// Implementation of the scan interface
func (ni nullableID) Scan(src interface{}) error {
	switch v := src.(type) {
	case int:
		*ni.ID = v
	case nil:
		*ni.ID = -1
	default:
		break
	}

	return nil
}

// small struct that can be embedded into repository implementations
// contains some methods for exposing a test context
type embeddedContext struct {
	ctx contexts.DatabaseContext
}

// utility function for testing
func (rep embeddedContext) GetContext() contexts.DatabaseContext {
	if !environment.IsTestingEnvironment() {
		panic("not in a testing environment")
	}

	return rep.ctx
}
