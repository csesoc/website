package data

import "cms.csesoc.unsw.edu.au/pkg/cmsjson"

// BooleanOperations represents an operation on a boolean type
// @implements OperationModel
type BooleanOperation struct {
	NewValue bool
}

// TransformAgainst is the BooleanOperation implementation of the operationModel interface
func (boolOp BooleanOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return boolOp, operation
}

// Apply is the BooleanOperation implementation of the OperationModel interface, it does nothing
func (boolOp BooleanOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	return parentNode, nil
}
