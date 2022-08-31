package data

import "cms.csesoc.unsw.edu.au/pkg/cmsjson"

// BooleanOperations represents an operation on a boolean type
// @implements OperationModel
type BooleanOperation struct {
	newValue bool
}

// TransformAgainst is the BooleanOperation implementation of the operationModel interface
func (boolOp BooleanOperation) TransformAgainst(operation OperationModel) (OperationModel, OperationModel) {
	return boolOp, operation
}

// Apply is the BooleanOperation implementation of the OperationModel interface, it does nothing
func (boolOp BooleanOperation) Apply(ast cmsjson.AstNode) cmsjson.AstNode {
	return ast
}
