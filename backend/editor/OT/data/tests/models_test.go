package tests

import (
	"fmt"
	"reflect"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels/cmsmodel"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
	"github.com/google/uuid"
)

// @implements Component
type ArraysData struct {
	Data [3]int
}

func (a ArraysData) Get(field string) (reflect.Value, error) {
	return reflect.Value{}, nil
}

func (a ArraysData) Set(field string, value reflect.Value) error {
	return nil
}

func (a ArraysData) SetField(field int, value reflect.Value) {}

var IMAGE_DOCUMENT_ID uuid.UUID = uuid.New()
var PARAGRAPH_ID uuid.UUID = uuid.New()
var DOCUMENT_ID uuid.UUID = uuid.New()

func setupDocument() cmsjson.AstNode {
	// image := cmsmodel.Image{
	// 	ImageDocumentID: IMAGE_DOCUMENT_ID,
	// 	ImageSource:     "big_morb.png",
	// }

	// paragraph := cmsmodel.Paragraph{
	// 	ParagraphID:    PARAGRAPH_ID,
	// 	ParagraphAlign: "center",
	// 	ParagraphChildren: []cmsmodel.Text{
	// 		{
	// 			Text:      "why morb is important",
	// 			Link:      "www.morb.com",
	// 			Bold:      true,
	// 			Italic:    true,
	// 			Underline: false,
	// 		},
	// 	},
	// }

	// arrayData := arraysData{
	// 	Data: [3]int{1, -10, 213},
	// }

	// document := cmsmodel.Document{
	// 	DocumentName: "morbed up",
	// 	DocumentId:   DOCUMENT_ID,
	// 	Content:      []cmsmodel.Component{image, paragraph, arrayData},
	// }
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
				"ParagraphChildren: [
					"Text": "why morb is important",
					"Link": "www.morb.com",
					"Bold": true,
					"Italic": true,
					"Underline": false
				]
			}, 
			{
				"$type": "ArraysData",
				"Data": [1, -10, 213]
			}
		]
	}`, DOCUMENT_ID.String(), IMAGE_DOCUMENT_ID.String(), PARAGRAPH_ID.String())

	config := cmsjson.Configuration{
		RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
			reflect.TypeOf((*cmsmodel.Component)(nil)).Elem(): {
				"Image":      reflect.TypeOf(cmsmodel.Image{}),
				"Paragraph":  reflect.TypeOf(cmsmodel.Paragraph{}),
				"ArraysData": reflect.TypeOf(ArraysData{}),
			},
		},
	}

	result, _ := cmsjson.UnmarshallAST[cmsmodel.Document](config, document)
	return result
}

func TestValidSliceField(t *testing.T) {
	setupDocument()
}

// func TestValidSliceField(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/0
// 	subpaths := []int{2, 0}

// 	prev, result, err := data.Traverse(testObj, subpaths)
// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	assert := assert.New(t)

// 	assert.Equal(reflect.Slice, prev.Kind())
// 	assert.Equal(3, prev.Len())

// 	assert.Equal(reflect.Struct, result.Kind())
// 	assert.Equal("Image", result.Type().Name())
// 	assert.Equal(IMAGE_DOCUMENT_ID, result.Field(0).Interface().(uuid.UUID))
// 	assert.Equal("big_morb.png", result.Field(1).String())
// }

// func TestInvalidFieldName(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/0/InvalidFieldName/0
// 	_, err := placeholder(testObj)
// 	expectedErrorMsg := "Invalid"
// 	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
// }

// func TestValidArrayField(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/2/Data/0
// 	subpaths := []int{2, 2, 0, 0}

// 	prev, result, err := data.Traverse(testObj, subpaths)
// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	assert := assert.New(t)

// 	assert.Equal(reflect.Int, result.Kind())
// 	assert.Equal(int64(1), result.Int())

// 	assert.Equal(reflect.Array, prev.Kind())
// 	assert.Equal(3, prev.Len())
// }

// func TestNonIntegerArrayIndex(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/asdf/Data
// 	_, err := placeholder(testObj)
// 	expectedErrorMsg := "Invalid"
// 	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
// }

// func TestOutOfBoundsArrayIndex(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/4/Data
// 	_, err := placeholder(testObj)
// 	expectedErrorMsg := "Invalid"
// 	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
// }

// func TestValidStructField(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/0/ImageDocumentID
// 	subpaths := []int{2, 0, 0}

// 	prev, result, err := data.Traverse(testObj, subpaths)
// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	assert := assert.New(t)

// 	// assert.Equal(reflect.String, result.Type().Kind()) // TODO: It should now be a uuid.UUID type, find some way to test
// 	assert.Equal(IMAGE_DOCUMENT_ID, result.Interface().(uuid.UUID))
// 	assert.Equal("Image", prev.Type().Name())
// 	assert.Equal(IMAGE_DOCUMENT_ID, prev.Field(0).Interface().(uuid.UUID))
// 	assert.Equal("big_morb.png", prev.Field(1).String())

// }

// func TestValidNestedFields(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/1/ParagraphChildren/0/Bold
// 	subpaths := []int{2, 1, 2, 0, 2}

// 	prev, result, err := data.Traverse(testObj, subpaths)
// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	assert := assert.New(t)

// 	assert.Equal(reflect.Bool, result.Type().Kind())
// 	assert.Equal(true, result.Bool())

// 	assert.Equal("Text", prev.Type().Name())
// 	assert.Equal("why morb is important", prev.Field(0).String())
// 	assert.Equal("www.morb.com", prev.Field(1).String())

// 	assert.Equal(true, prev.Field(2).Bool())
// 	assert.Equal(true, prev.Field(3).Bool())
// 	assert.Equal(false, prev.Field(4).Bool())
// }

// func TestValidGetFirstDepth(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/0/ImageDocumentID
// 	subpaths := []int{2, 0, 0}

// 	result, err := data.GetOperationTargetSite(testObj, subpaths)
// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	assert := assert.New(t)
// 	assert.Equal(IMAGE_DOCUMENT_ID, result.Interface().(uuid.UUID))
// }

// func TestValidGetNestedPrimitive(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/1/ParagraphChildren/0/Underline
// 	subpaths := []int{2, 1, 2, 0, 4}

// 	result, err := data.GetOperationTargetSite(testObj, subpaths)
// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	assert := assert.New(t)
// 	assert.False(result.Bool())
// }

// func TestTextEditUpdate(t *testing.T) {
// 	testObj := setupDocument()
// 	// Content/0/ImageDocumentID
// 	subpaths := []int{2, 0, 0}

// 	err := data.TextEditUpdate(testObj, subpaths, 1, 1, "o")

// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	result, err := data.GetOperationTargetSite(testObj, subpaths)
// 	if err != nil {
// 		log.Fatalf(err.Error())
// 	}

// 	assert := assert.New(t)
// 	assert.Equal("morb", result.String())

// }

// TODO: When TLB stuff is done, remove this and replace above with TLB code
func placeholder(datamodels.DataModel) ([]int, error) {
	return nil, fmt.Errorf("Invalid")
}
