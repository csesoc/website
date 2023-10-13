package cmsjson

import (
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

type TestJson struct {
	Int          int
	String       string
	Float        float32
	NestedStruct NestedStruct
	Interfaces   []DummyInterface
}

type NestedStruct struct {
	Key string
	Val string
}

type UnnestedStruct struct {
	RandomInteger int
}

type DummyInterface interface{}

func TestUnmarshallsProperly(t *testing.T) {
	assert := assert.New(t)
	json := `{
		"Int": 3,
		"String": "hello world",
		"Float": 3.2,
		"NestedStruct": {
			"Key": "Key",
			"Val": "Val"
		},
		"Interfaces": [
			{
				"type": "NestedStruct",
				"Key": "Key",
				"Val": "Val"
			},
			{
				"type": "UnnestedStruct",
				"RandomInteger": 3
			}
			{
				"type": "NestedStruct",
				"Key": None,
				"Val": None
			},
		]
	}`
	expected := TestJson{
		Int:    3,
		String: "hello world",
		Float:  3.2,
		NestedStruct: NestedStruct{
			Key: "Key",
			Val: "Val",
		},
		Interfaces: []DummyInterface{
			NestedStruct{
				Key: "Key",
				Val: "Val",
			},
			UnnestedStruct{
				RandomInteger: 3,
			},
			NestedStruct{
				Key: "0",
				Val: "0",
			},
		},
	}

	config := Configuration{
		RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
			reflect.TypeOf((*DummyInterface)(nil)).Elem(): {
				"NestedStruct":   reflect.TypeOf(NestedStruct{}),
				"UnnestedStruct": reflect.TypeOf(UnnestedStruct{}),
			},
		},
	}

	var result TestJson
	Unmarshall[TestJson](config, &result, []byte(json))
	assert.Equal(expected, result)
}

func TestMarshallsProperly(t *testing.T) {
	assert := assert.New(t)
	sampleJson := TestJson{
		Int:    3,
		String: "hello world",
		Float:  3.2,
		NestedStruct: NestedStruct{
			Key: "Key",
			Val: "Val",
		},
		Interfaces: []DummyInterface{
			NestedStruct{
				Key: "Key",
				Val: "Val",
			},
			UnnestedStruct{
				RandomInteger: 3,
			},
		},
	}

	config := Configuration{
		RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
			reflect.TypeOf((*DummyInterface)(nil)).Elem(): {
				"NestedStruct":   reflect.TypeOf(NestedStruct{}),
				"UnnestedStruct": reflect.TypeOf(UnnestedStruct{}),
			},
		},
	}

	assert.Equal(config.Marshall(sampleJson), `{"Int": 3,"String": "hello world","Float": 3.200000,"NestedStruct": {"Key": "Key","Val": "Val"},"Interfaces": [{"type": "NestedStruct", "Key": "Key","Val": "Val"},{"type": "UnnestedStruct", "RandomInteger": 3}]}`)
}
