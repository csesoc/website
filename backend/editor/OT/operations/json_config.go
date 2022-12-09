package operations

import (
	"reflect"

	"cms.csesoc.unsw.edu.au/editor/OT/datamodel"
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// models contains all the data models for the editor
// this is the configuration required for the cmsjson module
// cmsjson is a custom marshaller/unmarshaller that supports interface types
// cmsjson works with arbitrary schemas so this model can be changed on a whim
// note that cmsjson does not check that the provided types implement the interface
// so please check that everything works prior to running the CMS
var CmsJsonConf = cmsjson.Configuration{
	// Registration for cmsmodel, when the LP is finally merged with CSESoc Projects
	// this will also contain the registration for their data models
	RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
		// TODO: later allow this to be dynamically swapped out for different front-ends
		reflect.TypeOf((*datamodel.Component)(nil)).Elem(): {
			"image":     reflect.TypeOf(datamodel.Image{}),
			"paragraph": reflect.TypeOf(datamodel.Paragraph{}),
		},

		reflect.TypeOf((*datamodel.DataType)(nil)).Elem(): {
			"image":     reflect.TypeOf(datamodel.Image{}),
			"paragraph": reflect.TypeOf(datamodel.Paragraph{}),
		},

		// Type registrations for the OperationModel
		reflect.TypeOf((*OperationModel)(nil)).Elem(): {
			"integerOperation": reflect.TypeOf(IntegerOperation{}),
			"booleanOperation": reflect.TypeOf(BooleanOperation{}),
			"stringOperation":  reflect.TypeOf(StringOperation{}),

			"arrayOperation":  reflect.TypeOf(ArrayOperation{}),
			"objectOperation": reflect.TypeOf(ObjectOperation{}),
		},
	},
}
