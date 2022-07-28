package data

// applicator manages the application of request objects to a provided datamodel

import (
	"errors"
	"reflect"

	"cms.csesoc.unsw.edu.au/editor/data/datamodels"
)

// TODO:
// - Add error checking for the paths as we traverse, e.g missing an index when traversing an array (assuming we didn't reach the end)
// - Make sure the item we are adding keeps the validity of the object

// ApplyRequest takes a datamodel (as defined in the datamodels folder) and a request, it then proceeds to apply the request
// to the model, note that this assumes that the operation in the request has been appropriately transformed
func ApplyRequest(model datamodels.DataModel, request Request) error {
	_, err := GetOperationTargetSite(model, request.path)
	if err != nil {
		return err
	}

	switch editType := request.payload.GetType(); editType {
	case "textEdit":
	case "keyEdit":
	case "arrayEdit":
	default:
		return errors.New("invalid edit type")
	}

	return nil
}

// getOperationTargetSite Gets the target object at the end of the path, this is the operation that we need to apply
// our operation to
func GetOperationTargetSite(model datamodels.DataModel, subpaths []string) (reflect.Value, error) {
	_, target, err := Traverse(model, subpaths)
	if err != nil {
		return reflect.Value{}, err
	}

	return target, nil
}
