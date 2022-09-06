package data

import (
	"errors"
	"fmt"

	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// ArrayOperation is an operation on an array type
// @implements OperationModel
type ArrayOperation struct {
	Index    int
	NewValue int
}

// TransformAgainst is the ArrayOperation implementation of the operationModel interface
func (arrOp ArrayOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return arrOp, operation
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (arrOp ArrayOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	if children, _ := parentNode.JsonPrimitive(); children != nil {
		return nil, errors.New("parent node cannot be a primitive")
	}

	children, _ := parentNode.JsonObject()
	if children == nil {
		children, _ = parentNode.JsonArray()
	}

	maxIndex := len(children) - 1
	if applicationIndex < 0 || applicationIndex > maxIndex {
		return nil, fmt.Errorf("application index must be between 0 and %d", maxIndex)
	}

	resultArray, _ := children[applicationIndex].JsonArray()
	if resultArray == nil {
		return nil, errors.New("child at application index must be an array")
	}

	switch applicationType {
	case Insert:
		resultArray = append(resultArray[:arrOp.Index+1], resultArray[arrOp.Index:]...)
	case Delete:
		resultArray = append(resultArray[:arrOp.Index], resultArray[arrOp.Index+1:]...)
	default:
		return nil, fmt.Errorf("invalid edit type")
	}

	children[applicationIndex].UpdateArray(applicationIndex, cmsjson.ASTFromInterface(resultArray))
	return parentNode, nil
}
