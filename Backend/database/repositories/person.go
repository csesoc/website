// TITLE: user database repository layer
// Author: (Jacky: FafnirZ) (09/21)
// Refactor into database package: Varun

package repositories

import (
	"log"

	"cms.csesoc.unsw.edu.au/database/contexts"
	"cms.csesoc.unsw.edu.au/environment"
)

// Model for a user within the database
type Person struct {
	UID       int
	Email     string
	FirstName string
	// Hashed >:D
	Password string
	GroupID  int
}

// Note: only exists Email and Password
type IPersonRepository interface {
	PersonExists(Person) bool
	GetPersonWithDetails(Person) Person
}

type PersonRepository struct {
	ctx contexts.DatabaseContext
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

func (rep PersonRepository) GetTestContext() contexts.TestingContext {
	if !environment.IsTestingEnvironment() {
		panic("not in a testing environment")
	}

	return rep.ctx.(contexts.TestingContext)
}
