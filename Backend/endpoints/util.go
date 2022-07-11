package endpoints

import (
	"fmt"
	"net/http"

	"github.com/gorilla/schema"
)

func ThrowRequestError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(fmt.Sprintf(`{
		"status": %d,
		"body": {
			"response": "there was an error",
			"more_info": "%s"
		}
		}`, status, message)))
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

// ParseParamsToSchema expects the target to be a pointer
func ParseParamsToSchema(r *http.Request, acceptingMethod string, target interface{}) int {
	if acceptingMethod != r.Method {
		return http.StatusMethodNotAllowed
	}

	err := r.ParseForm()
	if err != nil {
		return http.StatusBadRequest
	}

	decoder := schema.NewDecoder()
	if r.Method != "POST" {
		err = decoder.Decode(target, r.Form)
	} else {
		err = decoder.Decode(target, r.PostForm)
	}
	if err != nil {
		return http.StatusBadRequest
	}

	return http.StatusOK
}
