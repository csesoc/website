package operations

import "cms.csesoc.unsw.edu.au/pkg/cmsjson"

// Noop represents a non-existent operation
// @implements OperationModel
type Noop struct {
	OperationType EditType
}

// TransformAgainst is the noop implementation of the operationModel interface
func (noop Noop) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return noop, operation
}

// Apply is the noop implementation of the OperationModel interface, it does nothing
func (noop Noop) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	return parentNode, nil
}

// getEditType is the noop implementation of the OperationModel interface
func (noop Noop) GetEditType() EditType {
	return noop.OperationType
}
