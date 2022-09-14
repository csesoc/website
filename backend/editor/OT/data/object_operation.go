package data

import (
	"errors"
	"fmt"

	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// ObjectOperation represents an operation we perform on an object
type ObjectOperation struct {
	NewValue datamodels.DataType
}

// TransformAgainst is the ArrayOperation implementation of the operationModel interface
func (objOp ObjectOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	return objOp, operation
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (objOp ObjectOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	var err error = nil
	if children, _ := parentNode.JsonObject(); children != nil {
		if applicationIndex < 0 || applicationIndex >= len(children) {
			return nil, fmt.Errorf("invalid application index, index %d out of bounds for object of size %d", applicationIndex, len(children))
		}
		switch applicationType {
		case Insert:
			operandAsAst := cmsjson.ASTFromValue(objOp.NewValue)
			err = parentNode.UpdateOrAddObjectElement(applicationIndex, operandAsAst)
		case Delete:
		default:
			err = errors.New("invalid edit type")
		}
		return parentNode, err
	}
	return nil, errors.New("invalid application of an object operation, expected parent node to be an object")
}
