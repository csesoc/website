package operations

import (
	"errors"
	"fmt"

	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// StringOperation represents an operation on a string type
// @implements OperationModel
type StringOperation struct {
	RangeStart, RangeEnd int
	NewValue             string
}

// TransformAgainst is the ArrayOperation implementation of the operationModel interface
func (stringOp StringOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return stringOp, operation
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (arrOp StringOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
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

	resultText, _ := children[applicationIndex].JsonPrimitive()
	if resultText == nil {
		return nil, errors.New("child at application index must be a primitive")
	}

	switch applicationType {
	case Insert:
		resultText = resultText.(string)[:arrOp.RangeStart] + arrOp.NewValue + resultText.(string)[arrOp.RangeEnd+1:]
	case Delete:
		resultText = resultText.(string)[:arrOp.RangeStart] + resultText.(string)[arrOp.RangeEnd+1:]
	default:
		return nil, fmt.Errorf("invalid edit type")
	}

	children[applicationIndex].UpdateOrAddPrimitiveElement(cmsjson.ASTFromValue(resultText))
	return parentNode, nil
}
