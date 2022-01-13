// TITLE: Login functions
// Created by (Jacky: FafnirZ) (09/21)
// Last modified by (Jacky: FafnirZ) (04/09/21)
// # # #
/*
This module handles the Login logic, with some input validation, as well
as querying from `database` module and comparing the user's hash if the
user exists
**/
package endpoints

import (
	"log"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/environment"
	_httpUtil "cms.csesoc.unsw.edu.au/internal/httpUtil"
	_session "cms.csesoc.unsw.edu.au/internal/session"

	"errors"
	"net/http"
	"regexp"
)

type User struct {
	Email    string
	Password string
}

// EXPECT it to be from a form (handle non form requests)
// email=___&password=____
// content-type: x-www-urlencoded
/*
	curl -v -d email=john.smith@gmail.com \
	-d password=password \
	localhost:8080/login
*/
func LoginHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "POST":
		err := r.ParseForm()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// get fields from form
		email := r.FormValue("email")
		password := r.FormValue("password")

		// initialise user class
		var user *User = &User{Email: email, Password: password}

		// input validation
		err = user.IsValidEmail()
		if err != nil {
			_httpUtil.ThrowRequestError(w, 500, err.Error())
			return
		}

		err = user.checkPassword()
		if err != nil {
			_httpUtil.ThrowRequestError(w, 500, err.Error())
			return
		}

		// else create a session if user's session isnt already created
		_session.CreateSession(w, r, user.Email)

		// will change to FRONTEND_URI soon
		//_httpUtil.SendResponse(w, "success")

		http.Redirect(w, r, environment.GetFrontendURI()+"/dashboard", http.StatusMovedPermanently)
		break
	case "DEFAULT":
		// only post requests are allowed
		http.Redirect(w, r, environment.GetFrontendURI()+"/login", http.StatusMovedPermanently)
		break
	}

}

// check username is valid
// uses a relatively strict regular expression
func (u *User) IsValidEmail() error {
	// email must be > 2 characters before the domain
	// white lists a few domains which are allowed
	// match alphanumeric greater than 2 letters
	// followed by optional (.something) greater than 0 times
	// I know it will fail the z{8} z{6} cases
	regex := `^(z[0-9]{7}|([a-zA-Z0-9]{2,})+(\.[a-zA-Z0-9]+)*)@(gmail.com|ad.unsw.edu|student.unsw.edu|hotmail.com|outlook.com)(.au)?$`
	r, _ := regexp.Compile(regex)

	// if the email doesnt match, throw error
	if match := r.MatchString(u.Email); !match {
		return errors.New("email format invalid")
	}
	return nil
}

// inports getCredentials from internal database package
func (u *User) checkPassword() error {
	hashedPassword := u.hashPassword()
	repository := repositories.GetRepository(repositories.PERSON).(repositories.IPersonRepository)

	if repository.PersonExists(repositories.Person{
		Email:    u.Email,
		Password: hashedPassword,
	}) {
		return errors.New("invalid credentials")
	} else {
		return nil
	}
}

// expecting a post request with body of form data
// expecting header to contain session-token
// will perform the redirection in frontend
// backend's job for logout is only to remove the HTTPONLY cookie

func LogoutHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "POST":
		authenticated, _ := _session.IsAuthenticated(w, r)
		log.Print(authenticated)
		if authenticated {
			// CORS headers
			w.Header().Set("Access-Control-Allow-Origin", environment.GetFrontendURI())
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			_session.RemoveSession(w, r)
			break
		} else {
			// if session-token is not valid, it will still remove the current cookie the frontend
			// is storing by returning a
			// Set-Cookie: session-token="" header
			w.Header().Set("Access-Control-Allow-Origin", environment.GetFrontendURI())
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			_session.RemoveSession(w, r)
			_httpUtil.ThrowRequestError(w, http.StatusUnauthorized, "unauthorized")
			break
		}

	default:
		// only GET requests are allowed
		_httpUtil.ThrowRequestError(w, http.StatusMethodNotAllowed, "Method Not allowed")
		break
	}

}

// TODO: hash function
func (u *User) hashPassword() string {
	// TODO: currently does not hash the password
	return u.Password
}
