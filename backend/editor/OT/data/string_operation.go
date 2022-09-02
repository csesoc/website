package data

import "cms.csesoc.unsw.edu.au/pkg/cmsjson"

// StringOperation represents an operation on a string type
// @implements OperationModel
type StringOperation struct {
	rangeStart, rangeEnd int
	newValue             string
}

// TransformAgainst is the ArrayOperation implementation of the operationModel interface
func (stringOp StringOperation) TransformAgainst(operation OperationModel) (OperationModel, OperationModel) {
	return stringOp, operation
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (arrOp StringOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) cmsjson.AstNode {
	return parentNode
}
