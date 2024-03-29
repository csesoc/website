package operations

import (
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

type (
	// EditType is the underlying type of an edit
	EditType int

	// OperationModel defines an simple interface an operation must implement
	OperationModel interface {
		TransformAgainst(op OperationModel, applicationType EditType) (OperationModel, OperationModel)
		Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error)
	}

	// Operation is the fundamental incoming type from the frontend
	Operation struct {
		Path                  []int
		OperationType         EditType
		AcknowledgedServerOps int

		IsNoOp    bool
		Operation OperationModel
	}
)

// EditType enum constants
const (
	Insert EditType = iota
	Delete
)

// NoOperation is a special constant that signifies an operation that does nothing
var NoOperation = Operation{IsNoOp: true, Operation: Noop{}}

// Parse is a utility function that takes a JSON stream and parses the input into
// a Request object
func ParseOperation(request string) (Operation, error) {
	var operation Operation
	if err := cmsjson.Unmarshall[Operation](CmsJsonConf, &operation, []byte(request)); err != nil {
		return Operation{}, err
	} else {
		return operation, nil
	}
}
