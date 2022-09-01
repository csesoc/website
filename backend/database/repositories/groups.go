package repositories

import (
	"log"
)

// Implements IGroupRepository
type groupsRepository struct {
	embeddedContext
}

func (rep groupsRepository) GetGroupInfo(g Groups) Groups {
	var result Groups
	err := rep.ctx.Query("SELECT * from groups where name = $1;", []interface{}{g.Name},
		&g.UID, &g.Name, &g.Permission)
	if err != nil {
		log.Print("get permissions error", err.Error())
	}
	return result
}
