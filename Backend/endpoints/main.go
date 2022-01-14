package endpoints

import (
	"encoding/json"
	"net/http"
)

// Basic organisation of a response we will receieve from the API
type Response struct {
	Status  int
	Message string
	Reponse interface{}
}

// This file contains a series of types defined to make writing http handlers
// a bit easier and less messy
type handler func(http.ResponseWriter, *http.Request) (int, interface{}, error)

// impl of http Handler interface so that it can serve http requests
func (fn handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if status, resp, err := fn(w, r); err != nil {
		// Write the response with an optional error message
		w.WriteHeader(status)
		out := Response{
			Status:  status,
			Reponse: resp,
		}

		switch status {
		case http.StatusBadRequest:
			out.Message = "missing parameters (check documentation)"
			break
		case http.StatusMethodNotAllowed:
			out.Message = "invalid method"
			break
		case http.StatusNotFound:
			out.Message = "unable to find requested object"
			break
		case http.StatusNotAcceptable:
			out.Message = "unable to preform requested operation"
			break
		case http.StatusOK:
			out.Message = "ok"
			break
		default:
			out.Message = "..."
			break
		}

		re, _ := json.Marshal(out)
		w.Write(re)

	} else {
		out, _ := json.Marshal(Response{
			Status:  http.StatusInternalServerError,
			Message: "something went wrong",
		})
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(out)
	}
}
