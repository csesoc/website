package models

import (
	"crypto/sha256"
	"regexp"

	"cms.csesoc.unsw.edu.au/database/repositories"
)

type (
	User struct {
		Email    string `schema:"Email"`
		Password string `schema:"Password"`
	}
)

// ValidEmail checks to see if the username is valid
//   - email must be > 2 characters before the domain
//   - white lists a few domains which are allowed
//   - match alphanumeric greater than 2 letters
//   - followed by optional (.something) greater than 0 times
//
// TODO: fix for {z8} and {z6} cases
func (u *User) IsValidEmail() bool {
	regex := `^(z[0-9]{7}|([a-zA-Z0-9]{2,})+(\.[a-zA-Z0-9]+)*)@(gmail.com|ad.unsw.edu|student.unsw.edu|hotmail.com|outlook.com)(.au)?$`
	r, _ := regexp.Compile(regex)
	return r.MatchString(u.Email)
}

// UserExists just checks if a user has a valid password
func (u *User) UserExists(personRepo repositories.PersonRepository) bool {
	hashedPassword := u.HashPassword()

	return personRepo.PersonExists(repositories.Person{
		Email:    u.Email,
		Password: hashedPassword,
	})
}

// HashPassword hashes a user's password
func (u *User) HashPassword() string {
	hashedBytes := sha256.Sum256([]byte(u.Password))
	return string(hashedBytes[:])
}
