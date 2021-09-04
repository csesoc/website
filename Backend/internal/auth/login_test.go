package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

/*
type User struct {
	Email    string
	Password string
}
*/

func TestValidEmail(t *testing.T) {
	// CASE: simple
	var user User = User{Email: "a@gmail.com", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: email not an email case
	user = User{Email: "aaaaaa", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		// type err to get string, err.Error()
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}

	// CASE: empty email
	user = User{Email: "", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}

	// CASE: z{7}@ad.unsw.edu.au
	user = User{Email: "z0000000@ad.unsw.edu.au", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: z{7}@student.unsw.edu.au
	user = User{Email: "z0000000@student.unsw.edu.au", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: firstname.lastname@ad.unsw.edu.au
	user = User{Email: "adam.smith@ad.unsw.edu.au", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: firstname.lastname@student.unsw.edu.au
	user = User{Email: "adam.smith@student.unsw.edu.au", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: lsajdlj@gmail.com
	user = User{Email: "adamsmith@gmail.com", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: asdas.jaslkdja@gmail.com
	user = User{Email: "adam.smith@gmail.com", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: asdas.jaslkdj.asda@gmail.com
	user = User{Email: "adam.smith.smithhy10101010@gmail.com", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: a.  .@gmail.com
	user = User{Email: "a.    .@gmail.com", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}

	// CASE: [all space]@gmail.com
	user = User{Email: "         @gmail.com", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}

	// CASE: aaaa@hotmail.com
	user = User{Email: "asdasd@hotmail.com", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}

	// CASE: non-whitelisted symbols
	user = User{Email: "asda`'\"sd@hotmail.com", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}

	// CASE: sql injection
	user = User{Email: "asda' or 1='1';--+", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}

	// potential re-dos
	// CASE: test@te.com <-- server seems to hang with this maybe its not a regex issue
	user = User{Email: "test@te.com", Password: "abc"}
	assert.Nil(t, user.isValidEmail())

	// CASE: HACKERMAN MAGIC STRING
	user = User{Email: "'\"~<lol/>;--+or+1='1`ls`%#--+;;", Password: "abc"}
	if assert.NotNil(t, user.isValidEmail()) {
		obj := user.isValidEmail()
		assert.Equal(t, "email format invalid", obj.Error())
	}
}
