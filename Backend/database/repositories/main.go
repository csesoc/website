package repositories

import "cms.csesoc.unsw.edu.au/database/contexts"

// Start up a database connection with a provided context
var context contexts.DatabaseContext

func init() {
	context = contexts.GetDatabaseContext()
}

// User groups configurations
const (
	GROUPS_ADMIN int = 1
	GROUPS_USER  int = 2
)

// enum of repositories
const (
	FILESYSTEM = iota
	PERSON
	GROUPS
)

// small factory for setting up and returning a repository
func GetRepository(repo int) interface{} {
	switch repo {
	case FILESYSTEM:
		return FilesystemRepository{
			context,
		}
	case PERSON:
		return PersonRepository{
			context,
		}
	case GROUPS:
		return GroupsRepository{
			context,
		}
	default:
		return nil
	}
}
