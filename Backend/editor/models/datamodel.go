package models

import (
	"encoding/json"
	"errors"
	"reflect"
	"strconv"
	"strings"
)

type Request struct {
	path    string  `json:"path"`
	op      string  `json:"op"`
	payload Payload `json:"payload"`
}

type Document struct {
	document_name string
	document_id   string
	content       []Component
}

// TODO:
// - Add error checking for the paths as we traverse, e.g missing an index when traversing an array (assuming we didn't reach the end)
// - Make sure the item we are adding keeps the validity of the object

func process(request string) (err error) {
	requestObject := Request{}
	if err := json.Unmarshal([]byte(request), &requestObject); err != nil {
		return errors.New("Invalid request format")
	}
	switch editType := requestObject.payload.GetType(); editType {
	case "textEdit":
		break
	case "keyEdit":
		break
	case "arrayEdit":
		break
	default:
		return errors.New("Invalid edit type")
	}
	return nil
}

// Parses a string path into the starting index of content, subpaths to reach said object
func pathParser(path string) ([]string, error) {
	subpaths := strings.Split(path, "/")
	// TODO: Maybe generalise this hardcoded check
	if len(subpaths) < 1 || subpaths[0] != "content" {
		return nil, errors.New("First subpath must be 'content'")
	}
	return subpaths, nil
}

// Converts the data string into the correct data type
func dataTypeEvaluator(dataStr string, dataType string) (data interface{}, err error) {
	switch dataType {
	case "integer":
		if result, err := strconv.ParseInt(dataStr, 10, 32); err != nil {
			return nil, errors.New("Data is not an integer")
		} else {
			return result, nil
		}
	case "boolean":
		if result, err := strconv.ParseBool(dataStr); err != nil {
			return nil, errors.New("Data is not a boolean")
		} else {
			return result, nil
		}
	case "float":
		if result, err := strconv.ParseFloat(dataStr, 64); err != nil {
			return nil, errors.New("Data is not a float")
		} else {
			return result, nil
		}
	case "string":
		return dataStr, nil
	case "component":
		var result Component
		if err := config.Unmarshall([]byte(dataStr), &result); err != nil {
			return nil, err
		} else {
			return result, nil
		}
	default:
		return nil, errors.New("Incompatible data type")
	}
}

// TODO: Error check index logic
func (d Document) get(path string) (interface{}, error) {
	paths, err := pathParser(path)
	if err != nil {
		return nil, err
	}
	// We get the parent struct/array
	target := paths[len(paths)-1]
	var parentPointer reflect.Value
	parentPointer = traverse(d, paths)
	// Check if we are dealing with an array/slice
	if parentPointer.Kind() == reflect.Array || parentPointer.Kind() == reflect.Slice {
		// Target must thus be an index if len(paths) > 1
		if len(paths) > 1 {
			if index, err := strconv.ParseInt(target, 10, 32); err != nil {
				return nil, err
			} else {
				return parentPointer.Elem().Index(int(index)), nil
			}
		} else { // Edge case for a path "content" -> we return everything inside it
			return parentPointer.Elem(), nil
		}
	}
	// We are dealing with a struct
	for i := 0; i < parentPointer.NumField(); i++ {
		field := parentPointer.Field(i)
		if field.Type().Field(i).Name == target {
			return field.Elem(), nil
		}
	}
	// Didn't find the key
	return nil, errors.New("Didn't find")
}

// TODO
// textEdit functions

// keyEdit functions

// arrayEdit functions
