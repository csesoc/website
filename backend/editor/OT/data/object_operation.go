package data

import (
	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// ObjectOperation represents an operation we perform on an object
type ObjectOperation struct {
	newValue datamodels.DataType
}

// TransformAgainst is the ArrayOperation implementation of the operationModel interface
func (objOp ObjectOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return objOp, operation
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (objOp ObjectOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) cmsjson.AstNode {
	return parentNode
}
