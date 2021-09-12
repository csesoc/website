// TITLE: Login functions
// Created by (Jacky: FafnirZ) (09/21)
// Last modified by (Jacky: FafnirZ)(12/09/21)
// # # #
/*
Logout functionalities
**/
package auth

import (
	_httpUtil "DiffSync/httpUtil"
	_session "DiffSync/internal/session"
	"log"

	"net/http"
)

// expecting a post request with body of form data
// expecting header to contain session-token
func LogoutHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "GET":
		log.Print("logging out")
		authenticated, _ := _session.IsAuthenticated(w, r)
		if authenticated {
			_session.RemoveSession(w, r)
			// redirect to login page
			http.RedirectHandler("http://localhost:3000/login", http.StatusMovedPermanently)
			break
		} else {
			// throws an error to client
			// 401 unauthorized
			// redirects to page
			_httpUtil.ThrowUnAuthorisedError(w)
			break
		}

	case "DEFAULT":
		// only GET requests are allowed
		_httpUtil.ThrowRequestError(w, 405, "Method Not allowed")
		break
	}

}
