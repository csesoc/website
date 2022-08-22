package data

// applicator manages the application of request objects to a provided datamodel

import (
	"errors"
	"reflect"

	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
)

// TODO:
// - Add error checking for the paths as we traverse, e.g missing an index when traversing an array (assuming we didn't reach the end)
// - Make sure the item we are adding keeps the validity of the object

// ApplyRequest takes a datamodel (as defined in the datamodels folder) and a request, it then proceeds to apply the request
// to the model, note that this assumes that the operation in the request has been appropriately transformed
func ApplyRequest(model datamodels.DataModel, request OperationRequest) error {
	// TODO: Use Gary's code here
	_, err := GetOperationTargetSite(model, []int{})
	if err != nil {
		return err
	}

	switch editType := request.OperationPayload.GetType(); editType {
	case TextEditType:
	case KeyEditType:
	case ArrayEditType:
	default:
		return errors.New("invalid edit type")
	}

	return nil
}

// getOperationTargetSite Gets the target object at the end of the path, this is the operation that we need to apply
// our operation to
func GetOperationTargetSite(model datamodels.DataModel, subpaths []int) (reflect.Value, error) {
	_, target, err := Traverse(model, subpaths)
	if err != nil {
		return reflect.Value{}, err
	}

	return target, nil
}
