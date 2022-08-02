package models

import (
	"errors"
	"log"
	"reflect"
	"strings"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/data"
	"cms.csesoc.unsw.edu.au/editor/data/datamodels/cmsmodel"
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
		Content:      []cmsmodel.Component{image, paragraph, arrayData},
	}
}

func TestValidSliceField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0"

	subpaths, err := ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}

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
	path := "Content/0/InvalidFieldName/0"

	subpaths, err := ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}

	_, _, err = data.Traverse(testObj, subpaths)
	assert.NotNil(t, err)
}

func TestValidArrayField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/2/Data/0"

	subpaths, err := ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}

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
	path := "Content/asdf/Data"

	subpaths, err := ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}

	_, _, err = data.Traverse(testObj, subpaths)
	assert.NotNil(t, err)
}

func TestOutOfBoundsArrayIndex(t *testing.T) {
	testObj := setupDocument()
	path := "Content/4/Data"

	subpaths, err := ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}

	_, _, err = data.Traverse(testObj, subpaths)
	assert.NotNil(t, err)
}

func TestValidStructField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0/ImageDocumentID"

	subpaths, err := ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}

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
	path := "Content/1/ParagraphChildren/0/Bold"

	subpaths, err := ParsePath(path)
	if err != nil {
		log.Fatalf(err.Error())
	}

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
	path := "Content/0/ImageDocumentID"
	pathArr, _ := ParsePath(path)

	result, err := data.GetOperationTargetSite(testObj, pathArr)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	assert.Equal("m0rb", result.String())
}

func TestValidGetNestedPrimitive(t *testing.T) {
	testObj := setupDocument()
	path := "Content/1/ParagraphChildren/0/Underline"
	pathArr, _ := ParsePath(path)

	result, err := data.GetOperationTargetSite(testObj, pathArr)
	if err != nil {
		log.Fatalf(err.Error())
	}

	assert := assert.New(t)
	assert.False(result.Bool())
}

func ParsePath(path string) ([]string, error) {
	subpaths := strings.Split(path, "/")
	if len(subpaths) < 1 || subpaths[0] != "Content" {
		return nil, errors.New("First subpath must be 'Content'")
	}
	return subpaths, nil
}
