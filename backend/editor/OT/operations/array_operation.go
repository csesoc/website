package operations

import (
	"errors"
	"fmt"

	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// ArrayOperation is an operation on an array type
// @implements OperationModel
type ArrayOperation struct {
	NewValue float64
	operationType EditType
}

// TransformAgainst is the ArrayOperation implementation of the operationModel interface
func (arrOp ArrayOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return arrOp, operation
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (arrOp ArrayOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	var err error = nil
	if children, _ := parentNode.JsonArray(); children != nil {
		if applicationIndex < 0 || applicationIndex > len(children) {
			return nil, fmt.Errorf("invalid application index, index %d out of bounds for array of size %d", applicationIndex, len(children))
		}

		if applicationType == Insert {
			operandAsAst := cmsjson.ASTFromValue(arrOp.NewValue)
			err = parentNode.UpdateOrAddArrayElement(applicationIndex, operandAsAst)
		} else {
			err = parentNode.RemoveArrayElement(applicationIndex)
		}

		return parentNode, err
	}

	return nil, errors.New("invalid application of an array operation, expected parent node to be an array")
}

// getEditType is the ArrayOperation implementation of the OperationModel interface
func (arrOp ArrayOperation) GetEditType() EditType {
	return arrOp.operationType
}

