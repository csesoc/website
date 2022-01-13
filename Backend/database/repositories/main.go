package repositories

import "cms.csesoc.unsw.edu.au/database/contexts"

// Start up a database connection with a provided context
var context contexts.DatabaseContext

func init() {
	context = contexts.GetDatabaseContext()
}

// enum of repositories
const (
	FILESYSTEM = iota
)

// small factory for setting up and returning a repository
func GetRepository(repo int) interface{} {
	switch repo {
	case FILESYSTEM:
		return FilesystemRepository{
			context,
		}
	default:
		return nil
	}
}
