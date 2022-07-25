package models

import (
	"encoding/json"
	"errors"
	"fmt"
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
	DocumentName string
	DocumentId   string
	Content      []Component
	tlb          map[string][]int
}

// TODO:
// - Add error checking for the paths as we traverse, e.g missing an index when traversing an array (assuming we didn't reach the end)
// - Make sure the item we are adding keeps the validity of the object

func process(request string) error {
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
func ParsePath(path string) ([]string, error) {
	subpaths := strings.Split(path, "/")
	// TODO: Maybe generalise this hardcoded check
	if len(subpaths) < 1 || subpaths[0] != "Content" {
		return nil, errors.New("First subpath must be 'Content'")
	}
	return subpaths, nil
}

// Converts the data string into the correct data type
func dataTypeEvaluator(dataStr string, dataType string) (interface{}, error) {
	var result interface{}
	var err error

	switch dataType {
	case "integer":
		result, err = strconv.ParseInt(dataStr, 10, 32)
	case "boolean":
		result, err = strconv.ParseBool(dataStr)
	case "float":
		result, err = strconv.ParseFloat(dataStr, 64)
	case "string":
		return dataStr, nil
	case "component":
		err = config.Unmarshall([]byte(dataStr), &result)
	}

	if err != nil {
		return nil, errors.New(fmt.Sprintf("Data is not a %s", dataType))
	}
	return result, nil
}

// Gets the target object at the end of the path
func (d Document) GetData(path string) (reflect.Value, error) {
	subpaths, err := ParsePath(path)
	if err != nil {
		return reflect.Value{}, err
	}
	parent, err := Traverse(d, subpaths)
	if err != nil {
		return reflect.Value{}, err
	}

	// Last value in path is our target
	target := subpaths[len(subpaths)-1]

	// Unless it is "Content", we simply return it
	if target == "Content" {
		return parent, nil
	}

	switch parentType := parent.Kind(); parentType {
	case reflect.Array, reflect.Slice:
		index, _ := strconv.ParseInt(target, 10, 32)
		if int(index) >= parent.Len() || int(index) < 0 {
			return reflect.Value{}, errors.New("Invalid target index")
		}
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

// Given a string path return the numerical list version of the path
func (d *Document) GetNumericalPath(path string) ([]int, error) {
	if d.tlb == nil {
		d.tlb = make(map[string][]int)
	}
	if val, ok := d.tlb[path]; ok {
		return val, nil
	}

	subpaths := strings.Split(path, "/")
	numericalPath := make([]int, len(subpaths))
	curr := reflect.ValueOf(*d)

	// Extract as much of the subpath as we can from the cache
	i := 0
	subpath := subpaths[i]
	subNumericalPath, hasSubpath := d.tlb[subpath]
	for hasSubpath {
		numericalPath[i] = subNumericalPath[i]
		curr = getValueFromIndex(curr, numericalPath[i])
		i++
		subpath += "/" + subpaths[i]
		subNumericalPath, hasSubpath = d.tlb[subpath]
	}

	// Loop through the subpaths and get numerical indexes
	var index int
	var err error
	for ; i < len(subpaths); i++ {
		// Get the next correct index
		if curr.Kind() == reflect.Array || curr.Kind() == reflect.Slice {
			index, err = strconv.Atoi(subpaths[i])
			if err != nil || index >= curr.Len() || index < 0 {
				return nil, errors.New("invalid target index")
			}
		} else {
			for index = 0; index < curr.NumField(); index++ {
				if curr.Type().Field(index).Name == subpaths[i] {
					break
				}
			}
			if index == curr.NumField() {
				return nil, errors.New("invalid path, couldn't find subpath " + subpaths[i])
			}
		}
		// Update curr and store index
		curr = getValueFromIndex(curr, index)
		numericalPath[i] = index
		d.tlb[subpath] = numericalPath[:i+1]
		subpath += "/" + subpaths[i]
	}
	d.tlb[path] = numericalPath
	return d.tlb[path], nil
}

// Given (array | slice | struct) and an index return the value at that index
func getValueFromIndex(curr reflect.Value, index int) reflect.Value {
	switch curr.Kind() {
	case reflect.Array:
		curr = curr.Elem().Index(index)
	case reflect.Slice:
		curr = curr.Index(index)
	case reflect.Struct:
		curr = curr.Field(index)
	}
	if curr.Kind() == reflect.Interface {
		curr = curr.Elem()
	}
	return curr
}
