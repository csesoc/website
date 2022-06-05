package models

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"
)

type Document struct {
	document_name string
	document_id   string
	content       []Component
}

// Parses a string path into the starting index of content, subpaths to reach said object
func pathParser(path string) (int, []string, error) {
	// We want to directly access the entire content array. i.e. ""
	if len(path) == 0 {
		return -1, nil, nil
	}
	subpaths := strings.Split(path, "/")
	start, err := strconv.ParseInt(subpaths[0], 10, 32)
	if err != nil {
		return -1, nil, fmt.Errorf("First argument was not an integer")
	}
	return int(start), subpaths[1 : len(subpaths)-1], nil
}

// TODO: Handling arrays: either frontend team does smth like .../array-index/... (but how does first value work)
// OR do we read ahead and be like if current path == array, then read ahead, otherwise if path ends here then we return the entire array?
func (d *Document) getContentComponent(path string) (interface{}, reflect.Type, error) {
	start, paths, err := pathParser(path)
	if err != nil {
		return nil, nil, err
	}
	// We want to get the entire contents array
	if start == -1 {
		return d.content, reflect.TypeOf(d.content), nil
	} else {
		curr := d.content[start]
		subpath := nil
		for i := 0; i < len(paths); i++ {
			// Distinguish between a field of integer type vs index
			subpath = paths[i]
			// Current subpath is an index
			// TODO: I'm assuming we won't need to error check if we are in an array
			if _, err := strconv.Atoi(subpath); err == nil {
				curr = 
			}
			curr.Get(paths[i])
		}
	}
	return nil, nil, fmt.Errorf("Couldn't find the said object")
}
