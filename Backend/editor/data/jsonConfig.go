package data

import (
	"errors"
	"reflect"
	"strconv"

	"cms.csesoc.unsw.edu.au/editor/data/datamodels/cmsmodel"
	"cms.csesoc.unsw.edu.au/internal/cmsjson"
)

// models contains all the data models for the editor
// this is the configuration required for the cmsjson module
// cmsjson is a custom marshaller/unmarshaller that supports interface types
// cmsjson works with arbitrary schemas so this model can be changed on a whim
// note that cmsjson does not check that the provided types implement the interface
// so please check that everything works prior to running the CMS
var cmsJsonConf = cmsjson.Configuration{
	// Registration for cmsmodel, when the LP is finally merged with CSESoc Projects
	// this will also contain the registration for their data models
	RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
		reflect.TypeOf((*cmsmodel.Component)(nil)).Elem(): {
			"image":     reflect.TypeOf(cmsmodel.Image{}),
			"paragraph": reflect.TypeOf(cmsmodel.Paragraph{}),
		},

		reflect.TypeOf((*Payload)(nil)).Elem(): {
			"textEdit":  reflect.TypeOf(TextEdit{}),
			"keyEdit":   reflect.TypeOf(KeyEdit{}),
			"arrayEdit": reflect.TypeOf(ArrayEdit{}),
		},
	},
}

// small helper function to parse a JSON value of a specific type
func parseDataGivenType(dataStr string, dataType string) (interface{}, error) {
	switch dataType {
	case "integer":
		return strconv.Atoi(dataStr)
	case "boolean":
		return strconv.ParseBool(dataStr)
	case "float":
		return strconv.ParseFloat(dataStr, 64)
	case "string":
		return dataStr, nil
	case "component":
		var result interface{}
		if err := cmsJsonConf.Unmarshall([]byte(dataStr), &result); err != nil {
			return nil, err
		}

		return result, nil
	}
	return nil, errors.New("unable to parse data type")
}
