package repositories

import (
	"log"

	"cms.csesoc.unsw.edu.au/database/contexts"
	"cms.csesoc.unsw.edu.au/environment"
)

// repository interface for the groups table within the database
type Groups struct {
	UID        int
	Name       string
	Permission string
}

type IGroupsRepository interface {
	// Only requires Groups.Name
	GetGroupInfo(Groups) Groups
}

type GroupsRepository struct {
	ctx contexts.DatabaseContext
}

func (rep GroupsRepository) GetGroupInfo(g Groups) Groups {
	var result Groups
	err := rep.ctx.Query("SELECT * from groups where name = $1;", []interface{}{g.Name},
		&g.UID, &g.Name, &g.Permission)
	if err != nil {
		log.Print("get permissions error", err.Error())
	}
	return result
}

func (rep GroupsRepository) GetTestContext() contexts.TestingContext {
	if !environment.IsTestingEnvironment() {
		panic("not in a testing environment")
	}

	return rep.ctx.(contexts.TestingContext)
}
