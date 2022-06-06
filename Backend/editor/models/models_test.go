package models

import "testing"

type TestDocument struct {
	document_name string
	document_id   string
	content       []Component
}

var testObj *TestDocument

func TestMain(m *testing.M) {
	testObj = &TestDocument{
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
}
