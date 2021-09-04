package auth

import (
	database "DiffSync/internal/database"

	"fmt"
	"log"
	"net/http"
)

type User struct {
	Username string
	Password string
}

// EXPECT it to be from a form (handle non form requests)
// username=___&password=____
// content-type: x-www-urlencoded

func LoginHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "POST":
		err := r.ParseForm()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		username := r.FormValue("username")
		password := r.FormValue("password")

		log.Print(username)
		fmt.Fprint(w, password)
		database.GetCredentials()
	}

}

// check for plaintest for now
// todo hashing and stuff
func checkCredentials() {

}
