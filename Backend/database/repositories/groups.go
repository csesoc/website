package repositories

import (
	"log"
)

// Implements IGroupRepository
type GroupsRepository struct {
	embeddedContext
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
