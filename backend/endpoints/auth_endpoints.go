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
	"fmt"
	"net/http"

	. "cms.csesoc.unsw.edu.au/endpoints/models"
	"cms.csesoc.unsw.edu.au/environment"
	"cms.csesoc.unsw.edu.au/internal/session"
)

// LoginHandler is a HTTP login handler
func LoginHandler(form User, w http.ResponseWriter, r *http.Request, df DependencyFactory) handlerResponse[empty] {
	if !form.IsValidEmail() || !form.UserExists(df.GetPersonsRepo()) {
		return handlerResponse[empty]{
			Status: http.StatusUnauthorized,
		}
	}

	session.CreateSession(w, r, form.Email)
	http.Redirect(w, r, fmt.Sprintf("%s/%s", environment.GetFrontendURI(), "dashboard"), http.StatusMovedPermanently)

	return handlerResponse[empty]{
		Status: http.StatusMovedPermanently,
	}
}

// LogoutHandler is just logs the user out of their current session
func LogoutHandler(form empty, w http.ResponseWriter, r *http.Request, df DependencyFactory) handlerResponse[empty] {
	w.Header().Set("Access-Control-Allow-Origin", environment.GetFrontendURI())
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	session.RemoveSession(w, r)

	return handlerResponse[empty]{
		Status: http.StatusOK,
	}
}
