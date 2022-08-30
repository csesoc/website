package data

import (
	"errors"

	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

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
	// IntegerOperation represents an operation on an integer type
	IntegerOperation struct {
		newValue int
	}

	// BooleanOperations represents an operation on a boolean type
	BooleanOperation struct {
		newValue bool
	}

	// StringOperation represents an operation on a string type
	StringOperation struct {
		rangeStart, rangeEnd int
		newValue             string
	}

	// ArrayOperation is an operation on an array type
	ArrayOperation struct {
		index   int
		payload datamodels.DataType
	}

	// ObjectOperation represents an operation we perform on an object
	ObjectOperation struct {
		payload datamodels.DataType
	}

	Noop struct{}

	OperationModel interface {
		TransformAgainst(OperationModel) (OperationModel, OperationModel)
		Apply(cmsjson.AstNode) cmsjson.AstNode
	}

	Operation struct {
		Path                  []int
		OperationType         EditType
		AcknowledgedServerOps int

		IsNoOp    bool
		Operation OperationModel
	}
)

// NoOperation is a special constant that signifies an operation that does nothing
var NoOperation = Operation{IsNoOp: true}

// Parse is a utility function that takes a JSON stream and parses the input into
// a Request object
func Parse(request string) (Operation, error) {
	if operation, err := cmsjson.Unmarshall[Operation](cmsJsonConf, []byte(request)); err != nil {
		return Operation{}, errors.New("invalid request format")
	} else {
		return *operation, nil
	}
}
