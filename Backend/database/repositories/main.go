package repositories

import "cms.csesoc.unsw.edu.au/database/contexts"

// Start up a database connection with a provided context
var context contexts.DatabaseContext = nil

// enum of repositories
const (
	FILESYSTEM = iota
	PERSON
	GROUPS
)

// The ID for root, set this as the ID in a specified request
const FILESYSTEM_ROOT_ID = 0

// small factory for setting up and returning a repository
func GetRepository(repo int) interface{} {
	if context == nil {
		context = contexts.GetDatabaseContext()
	}

	switch repo {
	case FILESYSTEM:
		return FilesystemRepository{
			embeddedContext{context},
		}
	case PERSON:
		return PersonRepository{
			embeddedContext{context},
		}
	case GROUPS:
		return GroupsRepository{
			embeddedContext{context},
		}
	default:
		return nil
	}
}
