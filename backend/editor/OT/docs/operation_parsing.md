# Operation Parsing & Application

Surprisingly most of the complexity in the OT editor lives in the operation parsing and application logic. This document aims to help demystify some of it. As a quick aside, everything regarding operations can be found in the `operation` folder.

## The operation struct
Operations (in Go) are defined as a struct, the operations we receive from the client conform to this structure and are parsed using a JSON parsing library (more on that later as there is a bit of complexity behind this). 
```go
type (
	// EditType is the underlying type of an edit
	EditType int

	// OperationModel defines an simple interface an operation must implement
	OperationModel interface {
		TransformAgainst(op OperationModel, applicationType EditType) (OperationModel, OperationModel)
		Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error)
	}

	// Operation is the fundamental incoming type from the frontend
	Operation struct {
		Path                  []int
		OperationType         EditType
		AcknowledgedServerOps int

		IsNoOp    bool
		Operation OperationModel
	}
)
```
The above code snippet uniquely defines an operation. Operations take a path to where in the document AST they are being applied (see the paper on tree based transform functions) and the physical operation being applied. The operation being applied (`OperationModel`) is actually an interface and is the reason why parsing operations is more complex than it seems. This interface defines two functions, one for transforming a operation against another operation and one for applying an operation to an AST. 

The reason why `OperationModel` is an interface is because there are several distinct types of operations we can apply for varying types. Theres different operations for editing an `integer`, `array`, `boolean`, `object` and `string` field. Each of these define their own transformation functions and application logic so in order to maintain a clean abstraction we use an interface. As an example this is how the `string` operation type implements this interface ![here](../operations/string_operation.go), its a rather intense implementation since it also implements string based transform functions.


## Operation application
Recall that the `document_server` maintains an abstract syntax tree for the current JSON document, this AST is exactly what `cmsjson.AstNode` is, the document server maintains the **root node**. When applying an operation to a document we invoke the `Operation.ApplyTo` function
```go
func (op Operation) ApplyTo(document cmsjson.AstNode) (cmsjson.AstNode, error) {
	parent, _, err := Traverse(document, op.Path)
	if err != nil {
		return nil, fmt.Errorf("failed to apply operation %v at target site: %w", op, err)
	}

	applicationIndex := op.Path[len(op.Path)-1]
	return op.Operation.Apply(parent, applicationIndex, op.OperationType)
}
```
this function traverses the document AST (as defined by the path) and applies the operation to the node pointed at by the path. The final application makes use of the `Apply` function within `OperationModel`.

## Operation Parsing
So as pointed out earlier, parsing is rather tricky as our `Operation` struct contains an interface and the native JSON parsing lib in Go does not support interfaces. To get around this problem we wrote our own JSON unmarshaller based on the `goson` json parser, we call this unmarshaller `cmsjson`. 

The `cmsjson` library expects a full list of all types that implement an interface we wish to parse into, this list of types is defined ![here](../operations/json_config.go)
```go
var CmsJsonConf = cmsjson.Configuration{
	RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
		/// ....

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
```
the configuration is in essence a mapping between the the `reflect.Type` representation of the interface and the `reflect.type` representation of every struct that "implements it". Implements is in quote as there is no way to statically verify this at compile time, instead if any of these config options are invalid a runtime error will be thrown during parsing. Usage of the `cmsjson` library for the most part is rather simple (thanks to generics in Go :D). An example can be found in the `ParseOperation` function within `operation_model.go`.

Interally the `cmsjson` library determines what struct to unmarshall into based on a `$type` attribute in a JSON object. Examples can be found in the test suite for the `cmsjson` library ![here](../../../pkg/cmsjson/cmsjson_test.go).

### More on `cmsjson`
This should ideally be under the `cmsjson` documentation but the library not only handles JSON unmarhsalling/marshalling but also exposes methods for constructing ASTs from a specific JSON document, this is used rather extensively by the `object_operation.go` object model to convert a document component to an AST. Once again, this is further documented within the `cmsjson` package, for the most part the package gives us the following interface for interacting with ASTs.
```go
	// jsonNode is the internal implementation of AstNode, *jsonNode @implements AstNode
	// AstNode is a simple interface that represents a node in our JSON AST, we have a few important constraints that should be enforced by any implementation of the AstNode, those constraints are:
	//	- An ASTNode is either a: JsonPrimitive, JsonObject or a JsonArray
	//		- GetKey can return nil indicating that it is JUST a value
	//		- Since a node can be either a JsonPrimitive, JsonObject or a JsonArray:
	// 			- 2 of the three functions: JsonPrimitive(), JsonObject(), JsonArray() will return nil (indicating the node is not of that type) while one will return an actual value
	//			- We are guaranteed that one of these functions will return a value
	//	- All implementations of AstNode must conform to this specification (there is no way within the Go type system to enforce this unfortunately :( )
	//	- Note that the reflect.Type returned by JsonArray is the type of the array, ie if it was an array of integers then the reflect.type is an integer
	//  - Note that jsonNode implements AstNode (indirectly), AstNode is of the form:
	AstNode interface {
		GetKey() string

		JsonPrimitive() (interface{}, reflect.Type)
		JsonObject() ([]AstNode, reflect.Type)
		JsonArray() ([]AstNode, reflect.Type)

		// Update functions, if the underlying type does not match then an error is thrown
		// ie if you perform an "UpdatePrimitive" on a JSONObject node
		UpdateOrAddPrimitiveElement(AstNode) error
		UpdateOrAddArrayElement(int, AstNode) error
		UpdateOrAddObjectElement(int, AstNode) error

		RemoveArrayElement(int) error
	}
```
If you look carefully, you can see how we attempted to emulate sum types using interfaces 😛.