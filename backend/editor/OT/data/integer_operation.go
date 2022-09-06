package data

import "cms.csesoc.unsw.edu.au/pkg/cmsjson"

// IntegerOperation represents an operation on an integer type
// @implementations of OperationModel
type IntegerOperation struct {
	NewValue int
}

// TransformAgainst is the IntegerOperation implementation of the operationModel interface
func (intOp IntegerOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return intOp, operation
}

// Apply is the IntegerOperation implementation of the OperationModel interface, it does nothing
func (intOp IntegerOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	return parentNode, nil
}
