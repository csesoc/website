package http

import (
	"fmt"
	"net/http"
)

const POST = "POST"
const GET = "GET"
const PUT = "PUT"
const DELETE = "DELETE"

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
