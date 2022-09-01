package data

import "cms.csesoc.unsw.edu.au/pkg/cmsjson"

// Noop represents a non-existent operation
// @implements OperationModel
type Noop struct{}

// TransformAgainst is the noop implementation of the operationModel interface
func (noop Noop) TransformAgainst(operation OperationModel) (OperationModel, OperationModel) {
	return noop, operation
}

// Apply is the noop implementation of the OperationModel interface, it does nothing
func (noop Noop) Apply(ast cmsjson.AstNode) cmsjson.AstNode {
	return ast
}
