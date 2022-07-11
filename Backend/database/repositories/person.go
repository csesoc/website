// TITLE: user database repository layer
// Author: (Jacky: FafnirZ) (09/21)
// Refactor into database package: Varun

package repositories

import (
	"log"
)

// Implements IPersonRepository
type PersonRepository struct {
	embeddedContext
}

func (rep PersonRepository) PersonExists(p Person) bool {
	var result int
	err := rep.ctx.Query("SELECT count(*) from person where email = $1 and password = $2;", []interface{}{p.Email, p.Password}, &result)
	if err != nil {
		log.Println("credentials match err", err.Error())
	}

	return result == 1
}

func (rep PersonRepository) GetPersonWithDetails(p Person) Person {
	var result Person
	err := rep.ctx.Query("SELECT * from person where email = $1 and password = $2;", []interface{}{p.Email, p.Password},
		&result.UID, &result.Email, &result.FirstName, &result.Password, &result.GroupID)
	if err != nil {
		log.Print("get permissions error", err.Error())
	}
	return result
}
