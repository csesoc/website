// TITLE: Login functions
// Created by (Jacky: FafnirZ) (09/21)
// Last modified by (Jacky: FafnirZ)(07/09/21)
// # # #
/*
This module handles the session logic
- creating session
- revoking session
- checking if session is valid
*/

package session

import (
	"encoding/gob"
	"errors"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
)

// global var
var (
	// will move this key to be part of environment variable some time else
	key           = []byte("super-secret-key")
	store         = sessions.NewCookieStore(key)
	cookie_prefix = "session-token"
)

type User struct {
	Email         string
	Authenticated bool
}

func init() {
	store.Options = &sessions.Options{
		Path:     "/",     // domain path
		MaxAge:   60 * 15, // expiry
		HttpOnly: true,    // http only
		Secure:   true,    // same site
	}

	//required
	gob.Register(User{})
}

// if session does not exist, create it
// else return session
func CreateSession(w http.ResponseWriter, r *http.Request, email string) {
	session, err := store.Get(r, cookie_prefix)
	if err != nil {
		log.Println("an error has occurred getting session")
		log.Print(err)
		return
	}

	// setting user to be authenticated/logged in
	user := User{
		Email:         email,
		Authenticated: true,
	}
	session.Values["user"] = user

	// save session
	err = session.Save(r, w)
	if err != nil {
		log.Println("an error has occurred saving session")
		log.Print(err)
		return
	}

}

// todo REMOVE SESSION
// delete session
func RemoveSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, cookie_prefix)
	if err != nil {
		log.Println("an error has occurred getting session")
		log.Print(err)
	}
	session.Values["Authenticated"] = false
	session.Save(r, w)
}

// checks if user is authenticated
// returns user obj
// email : string
func IsAuthenticated(w http.ResponseWriter, r *http.Request) (bool, error) {
	store, err := store.Get(r, cookie_prefix)
	if err != nil {
		return false, errors.New("session error")
	}

	user := getUsers(store)
	if logged := user.Authenticated; !logged {
		return false, errors.New("User is not authenticated")
	}

	// return user without error
	return true, nil

}

// returns user from session store
// if there exists such a user
func getUsers(s *sessions.Session) User {
	val := s.Values["user"]
	var user = User{}
	user, ok := val.(User)
	if !ok {
		return User{Authenticated: false}
	}
	return user
}
