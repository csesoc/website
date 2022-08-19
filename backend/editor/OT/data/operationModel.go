package data

import "errors"

type (
	OperationType int
	EditType      int
)

const (
	TextEditType OperationType = iota
	KeyEditType
	ArrayEditType
)

const (
	Insert EditType = iota
	Delete
)

type (
	// OperationRequest is the model for the structure of data coming from the client
	OperationRequest struct {
		// for compatibility reasons we maintain "actualPath" until path is replaced
		// just rename actualPath to path once we transition from string paths to integer paths
		Path             []string `json:"path"`
		ActualPath       []int
		EditType         EditType `json:"op"`
		OperationPayload Payload  `json:"payload"`
	}

	// Payload is the actual data contained within the request
	// there are 3 possible payload values, KeyEdit, ArrayEdit and ValueEdit
	Payload interface {
		GetType() OperationType
	}

	// TextEdit @implements Payload, it represents an edit
	// of some underlying text
	TextEdit struct {
		value string
		start int
		end   int
	}

	// KeyEdit @implements Payload, it represents the editing of a value
	// at a specific key
	KeyEdit struct {
		valueType string
		newValue  string
	}

	// ArrayEdit @implements Payload, it represents an editing of a specific
	// array index
	ArrayEdit struct {
		valueType string
		newValue  string
	}
)

// NoOperation is a special constant that signifies an operation that does nothing
var NoOperation = OperationRequest{}

// Interface implementations
func (t TextEdit) GetType() OperationType  { return TextEditType }
func (k KeyEdit) GetType() OperationType   { return KeyEditType }
func (a ArrayEdit) GetType() OperationType { return ArrayEditType }

// Parse is a utility function that takes a JSON stream and parses the input into
// a Request object
func Parse(request string) (OperationRequest, error) {
	requestObject := OperationRequest{}
	if err := cmsJsonConf.Unmarshall([]byte(request), &requestObject); err != nil {
		return OperationRequest{}, errors.New("invalid request format")
	}

	return requestObject, nil
}
