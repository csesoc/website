package operations

import (
	"errors"
	"reflect"

	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// IntegerOperation represents an operation on an integer type
// @implementations of OperationModel
type IntegerOperation struct {
	NewValue int
	OperationType EditType
}

// TransformAgainst is the IntegerOperation implementation of the operationModel interface
func (intOp IntegerOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return intOp, operation
}

// Apply is the IntegerOperation implementation of the OperationModel interface, it does nothing
func (intOp IntegerOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	var err error = nil
	if child, childType := parentNode.JsonPrimitive(); child != nil {
		if childType.Kind() != reflect.Int {
			return nil, errors.New("invalid application of a primitive operation, expected child node to be an integer")
		}
		operandAsAst := cmsjson.ASTFromValue(intOp.NewValue)
		err = parentNode.UpdateOrAddPrimitiveElement(operandAsAst)
		return parentNode, err
	}
	return nil, errors.New("invalid application of a primitive operation, expected parent node to be a primitive")
}

// getEditType is the IntegerOperation implementation of the OperationModel interface
func (intOp IntegerOperation) GetEditType() EditType {
	return intOp.OperationType
}

