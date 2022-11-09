package tests

import (
	"fmt"
	"log"
	"reflect"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/OT/datamodel"
	"cms.csesoc.unsw.edu.au/editor/OT/operations"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// @implements Component
type ArraysData struct {
	Data     [3]float64
	IntField int
}

func (a ArraysData) Get(field string) (reflect.Value, error) {
	return reflect.Value{}, nil
}

func (a ArraysData) Set(field string, value reflect.Value) error {
	return nil
}

var (
	IMAGE_DOCUMENT_ID string = uuid.New().String()
	PARAGRAPH_ID      string = uuid.New().String()
	DOCUMENT_ID       string = uuid.New().String()
)

func setupDocument() cmsjson.AstNode {
	document := fmt.Sprintf(`{
		"DocumentName": "morbed up",
		"DocumentId": "%s",
		"Content": [
			{
				"$type": "Image",
				"ImageDocumentID": "%s",
				"ImageSource": "big_morb.png"
			},
			{
				"$type": "Paragraph",
				"ParagraphID": "%s",
				"ParagraphAlign": "center",
				"ParagraphChildren": [
					{
						"Text": "why morb is important",
						"Link": "www.morb.com",
						"Bold": true,
						"Italic": true,
						"Underline": false
					}
				]
			}, 
			{
				"$type": "ArraysData",
				"Data": [1, -10, 213],
				"IntField": 7
			}
		]
	}`, DOCUMENT_ID, IMAGE_DOCUMENT_ID, PARAGRAPH_ID)

	config := cmsjson.Configuration{
		RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
			reflect.TypeOf((*datamodel.Component)(nil)).Elem(): {
				"Image":      reflect.TypeOf(datamodel.Image{}),
				"Paragraph":  reflect.TypeOf(datamodel.Paragraph{}),
				"ArraysData": reflect.TypeOf(ArraysData{}),
			},
		},
	}

	result, err := cmsjson.UnmarshallAST[datamodel.Document](config, document)
	if err != nil {
		panic(err)
	}

	return result
}

func TestValidStructField(t *testing.T) {
	document := setupDocument()
	// Content/0
	subpaths := []int{2, 0}

	prev, result, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	parent, _ := prev.JsonArray()
	assert.True(parent != nil)

	target, targetType := result.JsonObject()
	assert.True(target != nil)
	assert.Equal(len(target), 2)
	assert.Equal(targetType.Name(), "Image")

	child, _ := target[1].JsonPrimitive()
	assert.Equal(child, "big_morb.png")
}

func TestValidArrayField(t *testing.T) {
	document := setupDocument()
	// Content/2/Data/0
	subpaths := []int{2, 2, 0, 0}

	prev, result, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	parent, _ := prev.JsonArray()
	assert.True(parent != nil)

	target, _ := result.JsonPrimitive()
	assert.Equal(float64(1), target)
}

func TestValidNestedFields(t *testing.T) {
	document := setupDocument()
	// Content/1/ParagraphChildren/0/Bold
	subpaths := []int{2, 1, 2, 0, 2}

	prev, result, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	parent, _ := prev.JsonObject()
	assert.True(parent != nil)

	targetKey := result.GetKey()
	assert.Equal(targetKey, "Bold")
	targetVal, targetValType := result.JsonPrimitive()
	assert.Equal(targetValType.Kind(), reflect.Bool)
	assert.Equal(true, targetVal)

	textVal, _ := parent[0].JsonPrimitive()
	assert.Equal(textVal, "why morb is important")
	linkVal, _ := parent[1].JsonPrimitive()
	assert.Equal(linkVal, "www.morb.com")
	italicVal, _ := parent[3].JsonPrimitive()
	assert.Equal(italicVal, true)
	underlineVal, _ := parent[4].JsonPrimitive()
	assert.Equal(underlineVal, false)
}

func TestValidGetFirstDepth(t *testing.T) {
	document := setupDocument()
	// Content/0/ImageDocumentID
	subpaths := []int{2, 0, 0}

	_, result, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	target, _ := result.JsonPrimitive()
	assert.Equal(IMAGE_DOCUMENT_ID, target)
}

func TestValidGetNestedPrimitive(t *testing.T) {
	document := setupDocument()
	// Content/1/ParagraphChildren/0/Underline
	subpaths := []int{2, 1, 2, 0, 4}

	_, result, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	target, _ := result.JsonPrimitive()
	assert.Equal(target, false)
}

func TestInsertStringOperation(t *testing.T) {
	document := setupDocument()
	// Content/0/ImageSource
	subpaths := []int{2, 0, 1}

	jsonOperation := `{
		"Path": [2, 0, 1],
		"OperationType": 0,
		"AcknowledgedServerOps": 0,
		"IsNoOp": false,
		"Operation": {
			"$type": "stringOperation",
			"RangeStart": 5,
			"RangeEnd": 5,
			"NewValue": "0"
		}
	}`

	operation, err := operations.ParseOperation(jsonOperation)
	if err != nil {
		log.Fatalf(err.Error())
	}

	parent, _, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	result, err := operation.Operation.Apply(parent, 1, operations.Insert)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	resultNode, _ := result.JsonObject()
	resultContent, _ := resultNode[1].JsonPrimitive()
	assert.Equal("big_m0rb.png", resultContent)
}

func TestDeleteStringOperation(t *testing.T) {
	document := setupDocument()
	// Content/0/ImageSource
	subpaths := []int{2, 0, 1}

	jsonOperation := `{
		"Path": [2, 0, 1],
		"OperationType": 1,
		"AcknowledgedServerOps": 0,
		"IsNoOp": false,
		"Operation": {
			"$type": "stringOperation",
			"RangeStart": 5,
			"RangeEnd": 5,
			"NewValue": "0"
		}
	}`

	operation, err := operations.ParseOperation(jsonOperation)
	if err != nil {
		log.Fatalf(err.Error())
	}

	parent, _, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	result, err := operation.Operation.Apply(parent, 1, operations.Delete)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	resultNode, _ := result.JsonObject()
	resultContent, _ := resultNode[1].JsonPrimitive()
	assert.Equal("big_mrb.png", resultContent)
}

func TestInsertArrayOperation(t *testing.T) {
	document := setupDocument()
	// Content/2/Data/0
	subpaths := []int{2, 2, 0, 0}

	jsonOperation := `{
		"Path": [2, 2, 0],
		"OperationType": 0,
		"AcknowledgedServerOps": 0,
		"IsNoOp": false,
		"Operation": {
			"$type": "arrayOperation",
			"NewValue": 6
		}
	}`

	operation, err := operations.ParseOperation(jsonOperation)
	if err != nil {
		log.Fatalf(err.Error())
	}

	parent, _, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	result, err := operation.Operation.Apply(parent, 3, operations.Insert)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	children, _ := result.JsonArray()
	results := []float64{}
	for _, x := range children {
		value, _ := x.JsonPrimitive()
		results = append(results, value.(float64))
	}

	assert.Equal([]float64{1, -10, 213, 6}, results)
}

func TestUpdateArrayElement(t *testing.T) {
	document := setupDocument()
	// Content/2/Data/0
	subpaths := []int{2, 2, 0, 0}

	jsonOperation := `{
		"Path": [2, 2, 0],
		"OperationType": 0,
		"AcknowledgedServerOps": 0,
		"IsNoOp": false,
		"Operation": {
			"$type": "arrayOperation",
			"NewValue": 6
		}
	}`

	operation, _ := operations.ParseOperation(jsonOperation)

	parent, _, _ := operations.Traverse(document, subpaths)

	result, _ := operation.Operation.Apply(parent, 0, operations.Insert)

	assert := assert.New(t)

	children, _ := result.JsonArray()
	results := []float64{}
	for _, x := range children {
		value, _ := x.JsonPrimitive()
		results = append(results, value.(float64))
	}

	assert.Equal([]float64{6, -10, 213}, results)
}

func TestUpdateObjectElement(t *testing.T) {
	document := setupDocument()
	// Content/0
	subpaths := []int{2, 0, 0}

	jsonOperation := `{
		"Path": [2, 0, 0],
		"OperationType": 0,
		"AcknowledgedServerOps": 0,
		"IsNoOp": false,
		"Operation": {
			"$type": "objectOperation",
			"NewValue": {
				"$type": "image",
				"ImageDocumentID": "NEW_UUID",
				"ImageSource": "morb_dead_meme.jpg"
			}
		}
	}`

	operation, err := operations.ParseOperation(jsonOperation)
	if err != nil {
		log.Fatalf(err.Error())
	}

	parent, _, err := operations.Traverse(document, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	result, err := operation.Operation.Apply(parent, 0, operations.Insert)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	resultNode, _ := result.JsonObject()
	resultContent, _ := resultNode[0].JsonPrimitive()
	assert.Equal(resultContent, "NEW_UUID")
}

// func TestUpdateInteger(t *testing.T) {

// }

// TODO: When TLB stuff is done, remove this and replace above with call to TLB code
func placeholder(cmsjson.AstNode) ([]int, error) {
	return nil, fmt.Errorf("Invalid")
}

// TODO: I've made some stub tests for the TLB path validation. Use the string given in the comments in each test
func TestInvalidFieldName(t *testing.T) {
	document := setupDocument()

	// Content/0/InvalidFieldName/0
	_, err := placeholder(document)
	expectedErrorMsg := "Invalid"
	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
}

func TestNonIntegerArrayIndex(t *testing.T) {
	document := setupDocument()
	// Content/asdf/Data
	_, err := placeholder(document)
	expectedErrorMsg := "Invalid"
	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
}

func TestOutOfBoundsArrayIndex(t *testing.T) {
	document := setupDocument()
	// Content/4/Data
	_, err := placeholder(document)
	expectedErrorMsg := "Invalid"
	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
}
