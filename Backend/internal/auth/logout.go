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
// will perform the redirection in frontend
// backend's job for logout is only to remove the HTTPONLY cookie

func LogoutHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "POST":
		authenticated, _ := _session.IsAuthenticated(w, r)
		log.Print(authenticated)
		if authenticated {
			// CORS headers
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3001")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			_session.RemoveSession(w, r)
			break
		} else {
			// if session-token is not valid, it will still remove the current cookie the frontend
			// is storing by returning a
			// Set-Cookie: session-token="" header
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3001")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			_session.RemoveSession(w, r)
			_httpUtil.ThrowRequestError(w, http.StatusUnauthorized, "unauthorized")
			break
		}

	case "DEFAULT":
		// only GET requests are allowed
		_httpUtil.ThrowRequestError(w, http.StatusMethodNotAllowed, "Method Not allowed")
		break
	}

}
