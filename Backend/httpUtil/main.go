package httpUtil

import (
	"fmt"
	"net/http"

	"github.com/gorilla/schema"
)

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

// ErrorMessages maps HTTP errors to specific messages
type ErrorMessages map[int]string

// ParseParamsToSchema expects the target to be a pointer
func ParseParamsToSchema(w http.ResponseWriter, r *http.Request, acceptingMethods []string, errorMessages ErrorMessages, target interface{}) bool {
	err := r.ParseForm()
	if err != nil {
		ThrowRequestError(w, 400, errorMessages[400])
		return false
	}

	isValidMethod := false
	for _, method := range acceptingMethods {
		if method == r.Method {
			isValidMethod = true
			break
		}
	}

	if !isValidMethod {
		ThrowRequestError(w, 405, errorMessages[405])
		return false
	}

	decoder := schema.NewDecoder()
	err = decoder.Decode(target, r.Form)
	if err != nil {
		ThrowRequestError(w, 400, errorMessages[400])
		return false
	}

	return true
}
