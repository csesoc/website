// TITLE: Login functions
// Created by (Jacky: FafnirZ) (09/21)
// Last modified by (Jacky: FafnirZ)(12/09/21)
// # # #
/*
Test cases for login functions mainly email validation
**/
package tests

import (
	"testing"

	"cms.csesoc.unsw.edu.au/endpoints/models"
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
	user := models.User{Email: "aa@gmail.com", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: z{7}@ad.unsw.edu.au
	user = models.User{Email: "z0000000@ad.unsw.edu.au", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: z{7}@student.unsw.edu.au
	user = models.User{Email: "z0000000@student.unsw.edu.au", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: XXXXX.XXXXX@ad.unsw.edu.au
	user = models.User{Email: "adam.smith@ad.unsw.edu.au", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: XXXX.XXXX@student.unsw.edu.au
	user = models.User{Email: "adam.smith@student.unsw.edu.au", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: XXXXX@gmail.com
	user = models.User{Email: "adamsmith@gmail.com", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: XXX.XXX@gmail.com
	user = models.User{Email: "adam.smith@gmail.com", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: XXXX.XXX.XXXX@gmail.com
	user = models.User{Email: "adam.smith.smithhy10101010@gmail.com", Password: "abc"}
	assert.True(t, user.IsValidEmail())

	// CASE: XXXX@hotmail.com
	user = models.User{Email: "asdasd@hotmail.com", Password: "abc"}
	assert.True(t, user.IsValidEmail())
}

func TestInvalidEmail(t *testing.T) {
	// CASE: not an email
	user := models.User{Email: "aaaaaa", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		// type err to get string, err.Error()
		assert.False(t, user.IsValidEmail())
	}

	// CASE: empty email
	user = models.User{Email: "", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: a.  .@gmail.com
	// space between full stops
	user = models.User{Email: "a.    .@gmail.com", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: [all space]@gmail.com
	user = models.User{Email: "         @gmail.com", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: non-whitelisted symbols
	user = models.User{Email: "asda`'\"sd@hotmail.com", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: trailing full stop
	user = models.User{Email: "z0000000@ad.unsw.", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: @.
	user = models.User{Email: "z0000000@.unsw", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: XXXX.@ad.unsw.edu.au
	user = models.User{Email: "z0000000.@ad.unsw.edu.au", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: XXXX.@ad..com.
	user = models.User{Email: "z0000000.@ad..com.", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: XXXX@adcom
	// no full stop
	user = models.User{Email: "z0000000@testcom", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// disabled these tests because the regex cant handle them
	/*
		// CASE: z{7>}@adcom
		// no full stop
		user = User{Email: "z12345678@ad.unsw.edu.au", Password: "abc"}
		if assert.NotNil(t, user.isValidEmail()) {
			obj := user.isValidEmail()
			assert.Equal(t, "email format invalid", obj.Error())
		}

		// CASE: z{<7}@adcom
		// no full stop
		user = User{Email: "z123456@student.unsw.edu.au", Password: "abc"}
		if assert.NotNil(t, user.isValidEmail()) {
			obj := user.isValidEmail()
			assert.Equal(t, "email format invalid", obj.Error())
		}

		// CASE: z{0}@adcom
		// no full stop
		user = User{Email: "z@ad.unsw.edu.au", Password: "abc"}
		if assert.NotNil(t, user.isValidEmail()) {
			obj := user.isValidEmail()
			assert.Equal(t, "email format invalid", obj.Error())
		}
	*/
}

func TestValidEmailSecurity(t *testing.T) {
	// CASE: sql injection
	user := models.User{Email: "asda' or 1='1';--+", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: HACKERMAN MAGIC STRING
	user = models.User{Email: "'\"~<lol/>;--+or+1='1`ls`%#--+;;", Password: "abc"}
	if assert.NotNil(t, user.IsValidEmail()) {
		assert.False(t, user.IsValidEmail())
	}

	// CASE: Header Splitting payload

	// CASE:
}
