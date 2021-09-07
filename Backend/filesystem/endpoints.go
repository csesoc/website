package filesystem

import (
	"DiffSync/database"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/schema"
)

var httpDbPool database.Pool

// Todo: abstract out configuration logic elsewhere
func init() {
	var err error
	httpDbPool, err = database.NewPool(database.Config{
		HostAndPort: "db:5432",
		User:        "postgres",
		Password:    "postgres",
		Database:    "test_db",
	})

	if err != nil {
		panic(err)
	}
}

type ValidInfoRequest struct {
	EntityID int `schema:"EntityID,required"`
}

func ThrowRequestError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(fmt.Sprintf(`{
		"status": 405,
		"body": {
			"response": "there was an error",
			"more_info": "%s"
		}
		}`, message)))
}

func SendResponse(w http.ResponseWriter, marshaledJson string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write([]byte(fmt.Sprintf(`{
		"status": 200,
		"body": {
			"response": %s
		}
		}`, marshaledJson)))
}

// Defines endpoints consumable via the API
func GetEntityInfo(w http.ResponseWriter, r *http.Request) {
	decoder := schema.NewDecoder()
	routes := strings.Split(r.URL.RequestURI(), "/")

	err := r.ParseForm()
	if err != nil {
		ThrowRequestError(w, 400, "")
		return
	}

	switch routes[len(routes)-1] {
	case "root":
		fileInfo, err := getRootInfo(httpDbPool)
		if err != nil {
			ThrowRequestError(w, 500, "something went wrong")
			return
		}

		out, _ := json.Marshal(fileInfo)
		SendResponse(w, string(out))

		break
	default:
		var input ValidInfoRequest
		err = decoder.Decode(&input, r.Form)
		if err != nil {
			ThrowRequestError(w, 400, "missing RequestedID paramater")
			return
		}

		fileInfo, err := getFilesystemInfo(httpDbPool, input.EntityID)
		if err != nil {
			ThrowRequestError(w, 405, "unable to find entity with requested ID")
			return
		}

		out, _ := json.Marshal(fileInfo)
		SendResponse(w, string(out))
		break
	}
}

// TODO: this needs to be wrapped around auth and permissions later
type ValidEntityCreationRequest struct {
	Parent      int
	LogicalName string `schema:"LogicalName,required"`
	OwnerGroup  int    `schema:"OwnerGroup,required"`
	IsDocument  bool   `schema:"IsDocument,required"`
}

func CreateNewEntity(w http.ResponseWriter, r *http.Request) {
	decoder := schema.NewDecoder()
	err := r.ParseForm()
	if err != nil {
		ThrowRequestError(w, 400, "")
		return
	}

	if r.Method != "POST" {
		ThrowRequestError(w, 405, "invalid method")
		return
	}

	var input ValidEntityCreationRequest
	err = decoder.Decode(&input, r.Form)
	if err != nil {
		ThrowRequestError(w, 400, "missing paramaters, must have: LogicalName, OwnerGroup, IsDocument")
		return
	}

	var newID int
	if input.Parent == 0 {
		newID, err = createFilesystemEntityAtRoot(httpDbPool, input.LogicalName, input.OwnerGroup, input.IsDocument)
	} else {
		log.Print("hello there\n")
		newID, err = createFilesystemEntity(httpDbPool, input.Parent, input.LogicalName, input.OwnerGroup, input.IsDocument)
	}

	if err != nil {
		ThrowRequestError(w, 500, "unable to create entity (may be a duplicate)")
		return
	}
	SendResponse(w, fmt.Sprintf(`{"success": true, "newID": %d}`, newID))
}
