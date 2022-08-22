package tests

import (
	"fmt"
	"log"
	"reflect"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/OT/data"
	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels/cmsmodel"
	"github.com/stretchr/testify/assert"
)

// @implements Component
type arraysData struct {
	Data [3]int
}

func (a arraysData) Get(field string) (reflect.Value, error) {
	return reflect.Value{}, nil
}

func (a arraysData) Set(field string, value reflect.Value) error {
	return nil
}

func (a arraysData) SetField(field int, value reflect.Value) {}

func setupDocument() cmsmodel.Document {
	image := cmsmodel.Image{
		ImageDocumentID: "m0rb",
		ImageSource:     "big_morb.png",
	}

	paragraph := cmsmodel.Paragraph{
		ParagraphID:    "the morb",
		ParagraphAlign: "center",
		ParagraphChildren: []cmsmodel.Text{
			{
				Text:      "why morb is important",
				Link:      "www.morb.com",
				Bold:      true,
				Italic:    true,
				Underline: false,
			},
		},
	}

	arrayData := arraysData{
		Data: [3]int{1, -10, 213},
	}

	return cmsmodel.Document{
		DocumentName: "morbed up",
		DocumentId:   "M0R8",
		Content:      []cmsmodel.Component{&image, &paragraph, arrayData},
	}
}

func TestValidSliceField(t *testing.T) {
	testObj := setupDocument()
	// Content/0
	subpaths := []int{2, 0}

	prev, result, err := data.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	assert.Equal(reflect.Slice, prev.Kind())
	assert.Equal(3, prev.Len())

	assert.Equal(reflect.Struct, result.Kind())
	assert.Equal("Image", result.Type().Name())
	assert.Equal("m0rb", result.Field(0).String())
	assert.Equal("big_morb.png", result.Field(1).String())
}

func TestInvalidFieldName(t *testing.T) {
	testObj := setupDocument()
	// Content/0/InvalidFieldName/0
	_, err := placeholder(testObj)
	expectedErrorMsg := "Invalid"
	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
}

func TestValidArrayField(t *testing.T) {
	testObj := setupDocument()
	// Content/2/Data/0
	subpaths := []int{2, 2, 0, 0}

	prev, result, err := data.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	assert.Equal(reflect.Int, result.Kind())
	assert.Equal(int64(1), result.Int())

	assert.Equal(reflect.Array, prev.Kind())
	assert.Equal(3, prev.Len())
}

func TestNonIntegerArrayIndex(t *testing.T) {
	testObj := setupDocument()
	// Content/asdf/Data
	_, err := placeholder(testObj)
	expectedErrorMsg := "Invalid"
	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
}

func TestOutOfBoundsArrayIndex(t *testing.T) {
	testObj := setupDocument()
	// Content/4/Data
	_, err := placeholder(testObj)
	expectedErrorMsg := "Invalid"
	assert.EqualErrorf(t, err, expectedErrorMsg, "Error should be: %v, got: %v", expectedErrorMsg, err)
}

func TestValidStructField(t *testing.T) {
	testObj := setupDocument()
	// Content/0/ImageDocumentID
	subpaths := []int{2, 0, 0}

	prev, result, err := data.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	assert.Equal(reflect.String, result.Type().Kind())
	assert.Equal("m0rb", result.String())
	assert.Equal("Image", prev.Type().Name())
	assert.Equal("m0rb", prev.Field(0).String())
	assert.Equal("big_morb.png", prev.Field(1).String())

}

func TestValidNestedFields(t *testing.T) {
	testObj := setupDocument()
	// Content/1/ParagraphChildren/0/Bold
	subpaths := []int{2, 1, 2, 0, 2}

	prev, result, err := data.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)

	assert.Equal(reflect.Bool, result.Type().Kind())
	assert.Equal(true, result.Bool())

	assert.Equal("Text", prev.Type().Name())
	assert.Equal("why morb is important", prev.Field(0).String())
	assert.Equal("www.morb.com", prev.Field(1).String())

	assert.Equal(true, prev.Field(2).Bool())
	assert.Equal(true, prev.Field(3).Bool())
	assert.Equal(false, prev.Field(4).Bool())
}

func TestValidGetFirstDepth(t *testing.T) {
	testObj := setupDocument()
	// Content/0/ImageDocumentID
	subpaths := []int{2, 0, 0}

	result, err := data.GetOperationTargetSite(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	assert.Equal("m0rb", result.String())
}

func TestValidGetNestedPrimitive(t *testing.T) {
	testObj := setupDocument()
	// Content/1/ParagraphChildren/0/Underline
	subpaths := []int{2, 1, 2, 0, 4}

	result, err := data.GetOperationTargetSite(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	assert.False(result.Bool())
}

func TestTextEditUpdate(t *testing.T) {
	testObj := setupDocument()
	// Content/0/ImageDocumentID
	subpaths := []int{2, 0, 0}

	err := data.TextEditUpdate(testObj, subpaths, 1, 1, "o")

	if err != nil {
		log.Fatalf(err.Error())
	}

	result, err := data.GetOperationTargetSite(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	assert.Equal("morb", result.String())

}

func placeholder(datamodels.DataModel) ([]int, error) {
	return nil, fmt.Errorf("Invalid")
}
