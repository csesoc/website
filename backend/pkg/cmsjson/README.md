# CMSJson

CMSJson is our own custom in-house JSON marshalling library, the library marshalls JSON into an AST and verifies that the incoming JSON conforms to a specific type. After parsing and marshalling the generated AST supports the type-safe extension of the AST and allows the addition of substructures to the AST, the validity of these insertion/deletion operations is defined by the type provided when marshalling the type. 

## Usage
The library is relatively simple to use, we marshall un-marshal JSON data by provided a type template and a place to output it, eg: 
```go
type (
    myTemplateInner struct {
        hello   string
    }

    myTemplate struct {
        x       int
        y       string
        inner   myTemplateInner
    }
)

func main() {
    // There's two ways to use this library
    //  1. AST mode
    //  2. Un-marshall mode
    //      - The un-marshall mode can un-marshall a struct directly
    //      - If the output type specifies "ASTNode" however the will partially un-marshall the output

    // 1. AST MODE
    ast := cmsjson.UnmarshallAST[myTemplate](`
    {
        "x": 3,
        "y": "hello",
        inner: {
            "hello": "world"
        }
    }
    `)

    // outputs the AST nice a nice format
    fmt.Printf("AST: %s", ast.Stringify())

    // 2. Un-marshall mode
    // directly to a struct
    var dest = myTemplate{}
    cmsjson.Unmarshall[myTemplate](&dest)

    // directly to a struct with an AST type
    var dest = struct{
        x   int
        y   string
        inner cmsjson.AstNode
    }{}

    cmsjson.Unmarshall[myTemplate](&dest)
}
```
When un-marshalling into a type that contains an ASTNode the outputted value is the AST decomposition of the requested field.