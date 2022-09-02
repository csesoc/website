package data

import (
	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// ArrayOperation is an operation on an array type
// @implements OperationModel
type ArrayOperation struct {
	newValue datamodels.DataType
}

// TransformAgainst is the ArrayOperation implementation of the operationModel interface
func (arrOp ArrayOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return arrOp, operation
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (arrOp ArrayOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) cmsjson.AstNode {
	return parentNode
}
