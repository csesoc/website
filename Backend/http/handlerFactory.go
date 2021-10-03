// Handler Factory is set of utilities for generating http handlers
// based on some description of their function, the idea behind the handler
// factory is to reduce code duplication within our HTTP handlers and improve readability :)
// the file is literally just a bunch of rEfLeCtIoN mAgIc because GO STILL DOESNT HAVE GENERICS

package http

import (
	"DiffSync/database"
	"encoding/json"
	"net/http"
	"reflect"

	"github.com/gorilla/schema"
)

// Describes a configuration for a handler factory
type FactoryConfig struct {
	// Messages to throw on specific HTTP methods
	ErrorsMessages map[int]string
	DBContext      database.DatabaseContext
}

type httpPartialHandler func(w http.ResponseWriter, r *http.Request) bool
type HTTPHandler func(w http.ResponseWriter, r *http.Request)

type Inp interface{}
type DB database.DatabaseContext
type EndpointServicer func(DB, Inp) (Inp, error)

// BuildEndpoint generates a new handler that excepts
// some param info: inputTye is a the type of the form that all HTTP requests must be marshalled into, outputType is the type
// that all responses are marshalled into prior to a response while serviceMethod is the actual service method that handles the request
func (conf FactoryConfig) BuildEndpointOn(servicer EndpointServicer, inputType reflect.Type) httpPartialHandler {
	return func(w http.ResponseWriter, r *http.Request) bool {
		inputFormPointer := reflect.New(inputType)

		err := decodeSchema(r, inputFormPointer)
		if err != nil {
			return false
		}

		// finally service our request :)
		requestResult, err := servicer(conf.DBContext, inputFormPointer.Interface())
		if err != nil {
			return false
		}
		out, _ := json.Marshal(requestResult)
		SendResponse(w, string(out))

		return true
	}
}

// FallBack adds a fallback method to an existing partial handler
func (ph httpPartialHandler) FallsBackTo(fallback EndpointServicer, fallbackModel reflect.Type, conf FactoryConfig) httpPartialHandler {
	return func(w http.ResponseWriter, r *http.Request) bool {
		success := ph(w, r)

		inputFormPointer := reflect.New(fallbackModel)
		// We dont need to throw an error message as it will be caught by the fallback method
		if !success {
			// parse the fallback form
			err := decodeSchema(r, inputFormPointer)
			if err != nil {
				errorMessage := "Expected: "
				for i := 0; i < inputFormPointer.NumField(); i++ {
					errorMessage += inputFormPointer.Type().Name()
				}
				ThrowRequestError(w, 400, errorMessage)

				return false
			}

			// try the fallback method
			requestResult, err := fallback(conf.DBContext, inputFormPointer.Interface())
			if err != nil {
				return false
			}
			out, _ := json.Marshal(requestResult)
			SendResponse(w, string(out))

			return true
		}
		return false
	}
}

func (ph httpPartialHandler) OnErrorThrows(response string, status int) httpPartialHandler {
	return func(w http.ResponseWriter, r *http.Request) bool {
		if !ph(w, r) {
			ThrowRequestError(w, status, response)
			return false
		}
		return true
	}
}

// Accepting constraints the HTTP methods for a httpPartialHandler
func (ph httpPartialHandler) Accepts(methods ...string) HTTPHandler {
	return func(w http.ResponseWriter, r *http.Request) {
		// Check method
		isValidMethod := false
		for _, method := range methods {
			if method == r.Method {
				isValidMethod = true
				break
			}
		}

		if !isValidMethod {
			ThrowRequestError(w, 405, "invalid method")
			return
		}

		// Service the partial handler
		ph(w, r)
	}
}

// decodeSchema decodes the incoming http form
func decodeSchema(r *http.Request, inp reflect.Value) error {
	// Parse the incoming HTTP form
	err := r.ParseForm()
	if err != nil {
		return err
	}

	// Decode the incoming HTTP form
	decoder := schema.NewDecoder()
	if r.Method != "POST" {
		err = decoder.Decode(inp.Interface(), r.PostForm)
	} else {
		err = decoder.Decode(inp.Interface(), r.Form)
	}

	return err
}
