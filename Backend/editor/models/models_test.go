package models

import (
	"log"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

var testObj *Document

func TestMain(m *testing.M) {
	testObj = &Document{
		document_name: "morbed up",
		document_id:   "M0R8",
	}

	var children [2]Component
	image := &Image{
		ImageDocumentID: "m0rb",
		ImageSource:     "big_morb.png",
	}

	paragraph := &Paragraph{
		ParagraphID:    "the morb",
		ParagraphAlign: "center",
		ParagraphChildren: []Text{
			{
				text:      "why morb is important",
				link:      "www.morb.com",
				bold:      true,
				italic:    true,
				underline: false,
			},
		},
	}
	children[0] = image
	children[1] = paragraph
	testObj.content = children[:]
}

func TestGetFirstDepthField(t *testing.T) {
	path := "content/0"
	subpaths, err := pathParser(path)
	if err != nil {
		log.Fatalf(err.Error())
	}
	result := traverse(*testObj, subpaths)
	assert := assert.New(t)
	assert.Equal("Image", reflect.TypeOf(result).Name())
	assert.Equal("m0rb", result.Field(0))
	assert.Equal("big_morb.png", result.Field(1))
}
