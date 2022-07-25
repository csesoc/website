package models

import (
	"log"
	"reflect"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/models"
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

func setupDocument() models.Document {
	image := models.Image{
		ImageDocumentID: "m0rb",
		ImageSource:     "big_morb.png",
	}
	paragraph := models.Paragraph{
		ParagraphID:    "the morb",
		ParagraphAlign: "center",
		ParagraphChildren: []models.Text{
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
	return models.Document{
		DocumentName: "morbed up",
		DocumentId:   "M0R8",
		Content:      []models.Component{image, paragraph, arrayData},
	}
}

func TestValidSliceField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0"
	subpaths, err := models.ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result, err := models.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.Equal("slice", result.Kind().String())
	assert.Equal(3, result.Len())
}

func TestInvalidFieldName(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0/InvalidFieldName/0"
	subpaths, err := models.ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	_, err = models.Traverse(testObj, subpaths)
	assert.NotNil(t, err)
}

func TestValidArrayField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/2/Data/0"
	subpaths, err := models.ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result, err := models.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.Equal("array", result.Kind().String())
	assert.Equal(3, result.Len())
}

func TestNonIntegerArrayIndex(t *testing.T) {
	testObj := setupDocument()
	path := "Content/asdf/Data"
	subpaths, err := models.ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	_, err = models.Traverse(testObj, subpaths)
	assert.NotNil(t, err)
}

func TestOutOfBoundsArrayIndex(t *testing.T) {
	testObj := setupDocument()
	path := "Content/4/Data"
	subpaths, err := models.ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	_, err = models.Traverse(testObj, subpaths)
	assert.NotNil(t, err)
}

func TestValidStructField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0/ImageDocumentID"
	subpaths, err := models.ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result, err := models.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.Equal("Image", result.Type().Name())
	assert.Equal("m0rb", result.Field(0).String())
	assert.Equal("big_morb.png", result.Field(1).String())
}

func TestValidNestedFields(t *testing.T) {
	testObj := setupDocument()
	path := "Content/1/ParagraphChildren/0/Bold"
	subpaths, err := models.ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result, err := models.Traverse(testObj, subpaths)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.Equal("Text", result.Type().Name())
	assert.Equal("why morb is important", result.Field(0).String())
	assert.Equal("www.morb.com", result.Field(1).String())
	assert.Equal(true, result.Field(2).Bool())
	assert.Equal(true, result.Field(3).Bool())
	assert.Equal(false, result.Field(4).Bool())
}

func TestValidGetFirstDepth(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0/ImageDocumentID"
	result, err := testObj.GetData(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.Equal("m0rb", result.String())
}

func TestValidGetNestedPrimitive(t *testing.T) {
	testObj := setupDocument()
	path := "Content/1/ParagraphChildren/0/Underline"
	result, err := testObj.GetData(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.False(result.Bool())
}

func TestValidGetNumericalPath(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0/ImageSource"
	result, err := testObj.GetNumericalPath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.Equal([]int{2, 0, 1}, result)
}

func TestInValidGetNumericalIndex(t *testing.T) {
	testObj := setupDocument()
	path := "Content/100/ImageDocumentID"
	_, err := testObj.GetNumericalPath(path)
	assert := assert.New(t)
	assert.True(err != nil)
}

func TestValidCachedPathGetNumericalPath(t *testing.T) {
	assert := assert.New(t)
	testObj := setupDocument()
	path := "Content/1/ParagraphChildren"
	result, err := testObj.GetNumericalPath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert.Equal([]int{2, 1, 2}, result)
	// Check that getting a value already cached should work
	result, err = testObj.GetNumericalPath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert.Equal([]int{2, 1, 2}, result)
}

func TestValidCachedSubpathGetNumericalPath(t *testing.T) {
	testObj := setupDocument()
	path := "Content/1"
	result, err := testObj.GetNumericalPath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert := assert.New(t)
	assert.Equal([]int{2, 1}, result)
	// Check that getting a value with subpath cached should work
	path = path + "/ParagraphChildren"
	result, err = testObj.GetNumericalPath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert.Equal([]int{2, 1, 2}, result)
	// Check that getting a value with subpath up to a slice / array should work
	path = path + "/0/Link"
	result, err = testObj.GetNumericalPath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	assert.Equal([]int{2, 1, 2, 0, 1}, result)
}
