package data

import "cms.csesoc.unsw.edu.au/pkg/cmsjson"

// IntegerOperation represents an operation on an integer type
// @implementations of OperationModel
type IntegerOperation struct {
	newValue int
}

// TransformAgainst is the IntegerOperation implementation of the operationModel interface
func (intOp IntegerOperation) TransformAgainst(operation OperationModel) (OperationModel, OperationModel) {
	return intOp, operation
}

// Apply is the IntegerOperation implementation of the OperationModel interface, it does nothing
func (intOp IntegerOperation) Apply(ast cmsjson.AstNode) cmsjson.AstNode {
	return ast
}
