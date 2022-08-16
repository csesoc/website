package data

import "errors"

// Request is the model for the structure of data coming from the client
type Request struct {
	path    []string `json:"path"`
	op      string   `json:"op"`
	payload Payload  `json:"payload"`
}

// Payload is the actual data contained within the request
// there are 3 possible payload values, KeyEdit, ArrayEdit and ValuEdit
type Payload interface {
	GetType() string
}

// TextEdit @implements Payload, it represents an edit
// of some underlying text
type TextEdit struct {
	value string
	start int
	end   int
}

func (t TextEdit) GetType() string { return "TextEdit" }

// KeyEdit @implements Payload, it represents the editing of a value
// at a specific key
type KeyEdit struct {
	valueType string
	newValue  string
}

func (k KeyEdit) GetType() string { return "KeyEdit" }

// ArrayEdit @implements Payload, it represents an editing of a specific
// array index
type ArrayEdit struct {
	valueType string
	newValue  string
}

func (a ArrayEdit) GetType() string { return "ArrayEdit" }

// Parse is a utility function that takes a JSON stream and parses the input into
// a Request object
func Parse(request string) (Request, error) {
	requestObject := Request{}
	if err := cmsJsonConf.Unmarshall([]byte(request), &requestObject); err != nil {
		return Request{}, errors.New("invalid request format")
	}

	return requestObject, nil
}
