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
	Document_name string
	Document_id   string
	Content       []Component
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
func PathParser(path string) ([]string, error) {
	subpaths := strings.Split(path, "/")
	// TODO: Maybe generalise this hardcoded check
	if len(subpaths) < 1 || subpaths[0] != "Content" {
		return nil, errors.New("First subpath must be 'Content'")
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

// Gets the target object at the end of the path
func (d Document) GetData(path string) (reflect.Value, error) {
	paths, err := PathParser(path)
	if err != nil {
		return reflect.Value{}, err
	}
	parent := Traverse(d, paths)

	// Last value in path is our target
	target := paths[len(paths)-1]

	// Unless it is "Content", we simply return it
	if target == "Content" {
		return parent, nil
	}

	switch parentType := parent.Kind(); parentType {
	case reflect.Array, reflect.Slice:
		index, _ := strconv.ParseInt(target, 10, 32)
		if parentType == reflect.Slice {
			return parent.Index(int(index)), nil
		} else { // Array
			return parent.Elem().Index(int(index)), nil
		}
	case reflect.Struct:
		for i := 0; i < parent.NumField(); i++ {
			field := parent.Field(i)
			if parent.Type().Field(i).Name == target {
				return field, nil
			}
		}
	default:
		return reflect.Value{}, errors.New("Parent pointer was not an array, slice or struct")
	}

	// Didn't find the key
	return reflect.Value{}, errors.New("Path was invalid.")
}

// textEdit functions

// Add update text field
func (d Document) textEditUpdate(path string, start int, end int, data string) error {
	return nil
}

// Remove text field
func (d Document) textEditRemove(path string, start int, end int) error {
	return nil
}

// keyEdit functions

// Add data field
func (d Document) keyEditInsert(path string, data interface{}) error {
	return nil
}

// Remove data field
func (d Document) keyEditRemove(path string) error {
	return nil
}

// arrayEdit functions

// TODO: do we want to maintain the length too to reduce time complexity?

// Update element in array at "index" position
func (d Document) arrayEditUpdate(path string, index int, data interface{}) error {
	return nil
}

// Remove element in array at "index" position
func (d Document) arrayEditRemove(path string, index int) error {
	return nil
}
