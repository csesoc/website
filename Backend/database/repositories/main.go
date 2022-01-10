package repositories

import "cms.csesoc.unsw.edu.au/database/contexts"

// Start up a database connection with a provided context
var context contexts.DatabaseContext

func init() {
	context = contexts.GetDatabaseContext()
}
