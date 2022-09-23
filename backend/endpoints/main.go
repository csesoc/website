package endpoints

import (
	"encoding/json"
	"fmt"
	"net/http"

	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/internal/logger"
	"cms.csesoc.unsw.edu.au/internal/session"
)

// Basic organization of a response we will receive from the API
type (
	empty struct{}

	// handlerResponse is a special response type only returned by HTTP Handlers
	handlerResponse[V any] struct {
		Status   int
		Response V
	}

	// APIResponse is the public response type that is marshalled and presented to consumers of the API
	APIResponse[V any] struct {
		Status   int
		Message  string
		Response V
	}
)

type (
	handler[T, V any] struct {
		FormType    string
		Handler     func(form T, dependencyFactory DependencyFactory) (response handlerResponse[V])
		IsMultipart bool
	}

	// rawHandler is a handler that expect the incoming w and r request objects
	// note: raw handles REQUIRE authentication
	rawHandler[T, V any] struct {
		FormType    string
		Handler     func(form T, w http.ResponseWriter, r *http.Request, dependencyFactory DependencyFactory) (response handlerResponse[V])
		IsMultipart bool
		NeedsAuth   bool
	}

	// authenticatedHandler is basically a regular http handler the only difference is that
	// they can only be accessed by an authenticated client
	authenticatedHandler[T, V any] handler[T, V]
)

// ServeHTTP is an overloaded implementation of method on the http.HttpHandler interface
func (fn handler[T, V]) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Determine what type of form parser to use first
	parser := getParser(fn)
	parsedForm := new(T)

	if parseStatus := parser(r, fn.FormType, parsedForm); parseStatus != http.StatusOK {
		writeResponse(w, handlerResponse[empty]{
			Status:   parseStatus,
			Response: empty{},
		})

		return
	}

	// acquire the frontend ID and error out if the client isn't registered to use the CMS
	frontendId := 0 // getFrontendId(r)
	// if frontendId == repositories.InvalidFrontend {
	// writeResponse(w, handlerResponse[empty]{
	// Status:   http.StatusUnauthorized,
	// Response: empty{},
	// })
	//
	// return
	// }

	// construct a dependency factory for this request, which implies instantiating a logger
	logger := buildLogger(r.Method, r.URL.Path)
	dependencyFactory := DependencyProvider{Log: logger, FrontEndID: frontendId}
	response := fn.Handler(*parsedForm, dependencyFactory)

	// Record and write out any useful information
	writeResponse(w, response)
	logResponse(logger, response)
	logger.Close()
}

// ServeHTTP is an overloaded implementation of method on the http.HttpHandler interface, the constraint for the authenticateHandler
// is that it wraps the target handler up in an authentication check
func (fn authenticatedHandler[T, V]) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if ok, err := session.IsAuthenticated(w, r); !ok || err != nil {
		writeResponse(w, handlerResponse[empty]{
			Status:   http.StatusUnauthorized,
			Response: empty{},
		})

		return
	}

	// parse request over to main handler
	handler[T, V](fn).ServeHTTP(w, r)
}

// ServeHTTP is an overloaded implementation on the http.HttpHandler interface, it acts specifically on raw handlers
func (fn rawHandler[T, V]) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	handlerWrapper := func(form T, dependencyFactory DependencyFactory) handlerResponse[V] {
		return fn.Handler(form, w, r, dependencyFactory)
	}

	if fn.NeedsAuth {
		authenticatedHandler[T, V]{Handler: handlerWrapper, FormType: fn.FormType, IsMultipart: false}.ServeHTTP(w, r)
	} else {
		handler[T, V]{Handler: handlerWrapper, FormType: fn.FormType, IsMultipart: false}.ServeHTTP(w, r)
	}
}

// getFrontendID gets the frontend id for an incoming http request
func getFrontendId(r *http.Request) int {
	frontendRepo := repositories.NewFrontendsRepo()
	return frontendRepo.GetFrontendFromURL(r.URL.Host)
}

// getMessageFromStatus fetches the message corresponding to a given status code
func getMessageFromStatus(statusCode int) string {
	statusMappings := map[int]string{
		http.StatusBadRequest:          "missing parameters (check documentation)",
		http.StatusMethodNotAllowed:    "invalid method",
		http.StatusNotFound:            "unable to find requested object",
		http.StatusNotAcceptable:       "unable to preform requested operation",
		http.StatusInternalServerError: "somethings wrong I can feel it",
		http.StatusOK:                  "ok",
	}

	if message, ok := statusMappings[statusCode]; ok {
		return message
	}

	return "..."
}

// writeResponse is a small helper function to write out a received handler response to the response writer
func writeResponse[V any](dest http.ResponseWriter, response handlerResponse[V]) {
	var out interface{}

	if response.Status != http.StatusOK {
		out = getErrorResponse(response)
	} else {
		out = APIResponse[V]{
			Status:   response.Status,
			Response: response.Response,
			Message:  getMessageFromStatus(response.Status),
		}
	}

	dest.Header().Set("Content-Type", "application/json")
	dest.WriteHeader(response.Status)
	re, _ := json.Marshal(out)
	dest.Write(re)
}

// getErrorResponse does the exact same thing as write response except it's specific to errors
func getErrorResponse[V any](response handlerResponse[V]) APIResponse[empty] {
	return APIResponse[empty]{
		Status:   response.Status,
		Response: empty{},
		Message:  getMessageFromStatus(response.Status),
	}
}

// buildLogger instantiates a logger instance given a method / endpoint of the handler
func buildLogger(method string, endpoint string) *logger.Log {
	return logger.OpenLog(fmt.Sprintf("Handling http %s request to %s", method, endpoint))
}

// logResponse just logs a handler response under the provided log
func logResponse[V any](logger *logger.Log, response handlerResponse[V]) {
	switch response.Status {
	case http.StatusOK:
		logger.Write("successfully handled request")
	default:
		logger.Write(fmt.Sprintf("failed to handle request! status: %d \nresponse %v", response.Status, response.Response))
	}
}

// formParser is a type indicating a valid form parser (see below)
type formParser = func(*http.Request, string, interface{}) int

// getParser fetches the required parser for a specific handler configuration
func getParser[T, V any](config handler[T, V]) formParser {
	if config.IsMultipart {
		return ParseMultiPartFormToSchema
	}

	return ParseParamsToSchema
}
