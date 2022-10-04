# Writing Tests
The following is just a small guide on the process of unit testing within our codebase. Most if not all of our unit tests are written using a combination of `gomock` (Go's mocking framework) and Go's inbuilt testing engine `go test`.

## Using Go Test
Go has a really nice and clean testing library in the form of `testing`. Testing is usually done on a package/file level, that is for each file/package we have an appropriate set of tests. To mark a file as a test file we simply add the suffix `_test` to the end of it, eg. `concurrency.go` would have the corresponding test file `concurrency_test.go`. Generally test files look something like
```go
package math

import (
    "testing"
    // a nice library we use to make assertations a lot cleaner
    "github.com/stretchr/testify/assert"
)

// Tests must be marked with the "Test" prefix, this tells go that the following method is a test
// under the hood what actually happens is that go test is a code generation tool, this code generation tool generates a
// main function that invokes all methods starting with "Test", it then compiles and runs this generated file
func TestAdd(t *testing.T) {
    // The normal Go way
    result := 1 + 2
    if result != 3 {
        t.ErrorF("1 + 2 wasnt 3 :O")
    }

    // Our way of writing this test
    assert := assert.New(t)
    assert.Equal(1 + 2, 3)
}
```
Once you've written your test it can be run with:
```sh
# To run specifically this test
go test myTest_test.go
# To run all tests
go test  ./...
```

## Project Specific Quirks
Theres some weird quirks when it comes to writing project specific tests, this includes stuff such as interface mocking and writing database bound tests.

### Database Bound Tests
Generally it is preffered if your tests do not touch an actual database (see the section on mocking for how to acheive this) but sometimes it is just unavoidable, eg. you may be writing a test in the `repository` package which is inherently database bound. 