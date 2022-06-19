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

func (a *arraysData) Get(field string) (reflect.Value, error) {
	return reflect.Value{}, nil
}

func (a *arraysData) Set(field string, value reflect.Value) error {
	return nil
}

// @implements Component
type mapsData struct {
	Data map[string]int
}

func (m *mapsData) Get(field string) (reflect.Value, error) {
	return reflect.Value{}, nil
}

func (m *mapsData) Set(field string, value reflect.Value) error {
	return nil
}

func setupDocument() *models.Document {
	testObj := &models.Document{
		Document_name: "morbed up",
		Document_id:   "M0R8",
		Content:       make([]models.Component, 4),
	}

	image := &models.Image{
		ImageDocumentID: "m0rb",
		ImageSource:     "big_morb.png",
	}

	paragraph := &models.Paragraph{
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

	var array [3]int
	array[0] = 1
	array[1] = -10
	array[2] = 213
	arrayData := &arraysData{
		Data: array,
	}

	mapData := &mapsData{
		Data: map[string]int{"huh": 231, "bruh": 309},
	}

	testObj.Content[0] = image
	testObj.Content[1] = paragraph
	testObj.Content[2] = arrayData
	testObj.Content[3] = mapData

	return testObj
}

func TestSliceField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0"
	subpaths, err := models.PathParser(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result := models.Traverse(*testObj, subpaths)
	assert := assert.New(t)
	assert.Equal("slice", result.Kind().String())
	assert.Equal(4, result.Len())
}

func TestArrayField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/2/Data/0"
	subpaths, err := models.PathParser(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result := models.Traverse(*testObj, subpaths)
	assert := assert.New(t)
	assert.Equal("array", result.Kind().String())
	assert.Equal(3, result.Len())
}

func TestStructField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/0/ImageDocumentID"
	subpaths, err := models.PathParser(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result := models.Traverse(*testObj, subpaths)
	assert := assert.New(t)
	assert.Equal("Image", result.Type().Name())
	assert.Equal("m0rb", result.Field(0).String())
	assert.Equal("big_morb.png", result.Field(1).String())
}

func TestMapField(t *testing.T) {
	testObj := setupDocument()
	path := "Content/3/Data/huh"
	subpaths, err := models.PathParser(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result := models.Traverse(*testObj, subpaths)
	assert := assert.New(t)
	assert.Equal("map", result.Kind().String())
	actual := result.Interface().(map[string]int)

	expected := map[string]int{"huh": 231, "bruh": 309}

	for elem, _ := range actual {
		if val, found := expected[elem]; found {
			assert.Equal(val, actual[elem])
		} else {
			log.Fatal("Couldn't find ", elem, " as a key in expected values.")
		}
	}
}

func TestNestedFields(t *testing.T) {
	testObj := setupDocument()
	path := "Content/1/ParagraphChildren/0/Bold"
	subpaths, err := models.PathParser(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result := models.Traverse(*testObj, subpaths)
	assert := assert.New(t)
	assert.Equal("Text", result.Type().Name())
	assert.Equal("why morb is important", result.Field(0).String())
	assert.Equal("www.morb.com", result.Field(1).String())
	assert.Equal(true, result.Field(2).Bool())
	assert.Equal(true, result.Field(3).Bool())
	assert.Equal(false, result.Field(4).Bool())
}
