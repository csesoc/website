package operations

import (
	"errors"
	"reflect"

	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// BooleanOperations represents an operation on a boolean type
// @implements OperationModel
type BooleanOperation struct {
	NewValue bool
	operationType EditType
}

// TransformAgainst is the BooleanOperation implementation of the operationModel interface
func (boolOp BooleanOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return boolOp, operation
}

// Apply is the BooleanOperation implementation of the OperationModel interface, it does nothing
func (boolOp BooleanOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	var err error = nil
	if child, childType := parentNode.JsonPrimitive(); child != nil {
		if childType.Kind() != reflect.Bool {
			return nil, errors.New("invalid application of a primitive operation, expected child node to be a boolean")
		}
		operandAsAst := cmsjson.ASTFromValue(boolOp.NewValue)
		err = parentNode.UpdateOrAddPrimitiveElement(operandAsAst)
		return parentNode, err
	}
	return nil, errors.New("invalid application of a primitive operation, expected parent node to be a primitive")
}

// getEditType is the BooleanOperation implementation of the OperationModel interface
func (boolOp BooleanOperation) GetEditType() EditType {
	return boolOp.operationType
}

