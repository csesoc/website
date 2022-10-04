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
Generally it is preffered if your tests do not touch an actual database (see the section on mocking for how to acheive this) but sometimes it is just unavoidable, eg. you may be writing a test in the `repository` package which is inherently database bound. To allow you to write such tests we require that database-bound tests are wrapped in a transaction, luckilly there is a convenient package (+ some really hacky code that should be refactored someday) that both enforces that requirement and helps you acheive it.

#### Testing Contexts
We write database bound tests by using a `testing context`, a testing context refers to a connection to any database, this can be the live CMS database, your local version or a test database you spun up for testing. All contexts implement the [context interface](https://github.com/csesoc/website/blob/main/backend/database/contexts/main.go#L25), all database queries should be made via the context interface.

There are two main implementations of the context interface, those are the `liveContext` and the `TestingContext`, the `liveContext` will panic whenever it is used within a test, so when writing tests make sure your pass a `testingContext` as an argument. The implementation that `TestingContext` exposes wraps every SQL query in a transaction and rolls it back upon completion, this gives us complete isolation between unit tests. We can write a simple database bound test as follows
```go
func TestRootInsert(t *testing.T) {
    testContext := database.GetDatabaseContext().(*contexts.TestingContext)

    // to start a transaction (a test) we have to wrap the test in the runTest function, if we do not run our tests
    // via this function then the context panics whenever you try and send a query (for good reason :P)
    testContext.RunTest(func() {
        // your test here
    })

    // after your test finishes the context rollsback the constructed transaction
}
```

As a side-note, don't go looking around the database package, its a bit of a mess 😔, I'll have a refactoring ticket created some day to just clean up that package. 

### Interface Mocking
As should have been rather evident from the last section, writing database bounds tests can be a bit of a pain, we need to wrap our tests in a transaction to try and ensure complete test isolation. There is a potential workaround however and that is via writing better tests 😛. Consider a simple endpoint function that we wish to unit test, this endpoint will depend on:
 - A database connection
    - To access the Filesystem, Groups and Users tables
 - A connection to our published/unpublished volumes
 - A log

When writing tests for this endpoint the naive thing to do would be to create a testing context, spin up a connection to the published/unpublished volumes and pass that into your function and finally assert that it did what you wanted it to. The issue with this approach is that now you're not just testing your singular function but your ENTIRE system which leads to really slow tests and makes refactoring a pain (since you may have to update several unrelated tests). The smarter approach would be to use a method known as interface mocking, the idea behind interface mocking is that we provide a fake implementation of our interfaces to our functions, we then use that fake implementation to asser that the function did exactly what we wanted it to do. Within the CMS we use `gomock` to generate interface mocks, a general guide on interface mocking and `gomock` can be found [here](https://thedevelopercafe.com/articles/mocking-interfaces-in-go-with-gomock-670b1a640b00). Generally when writing tests the only mocks that will be of importance to you are the `dependency factory` and `repository` mocks, these can be found [here](https://github.com/csesoc/website/blob/main/backend/database/repositories/mocks/models_mock.go), to use them simply import that package into your file. 

An example of how we use interface mocking in practice can be seen below:
```go
func TestValidEntityInfo(t *testing.T) {
	controller := gomock.NewController(t)
	assert := assert.New(t)
	defer controller.Finish()

	// ==== test setup =====
	entityID := uuid.New()

	// Constructing a fake filesystem repository mock
	// note that we feed it a "fake" implementation, we're basically saying that whenever this fake function is called
	// return this fake data we set it up with
	mockFileRepo := repMocks.NewMockIFilesystemRepository(controller)
	mockFileRepo.EXPECT().GetEntryWithID(entityID).Return(repositories.FilesystemEntry{
		EntityID:     entityID,
		LogicalName:  "random name",
		IsDocument:   false,
		ParentFileID: repositories.FilesystemRootID,
		ChildrenIDs:  []uuid.UUID{},
	}, nil).Times(1)

	// creates a dependecy factory mock
	mockDepFactory := createMockDependencyFactory(controller, mockFileRepo, true)

	// ==== test execution =====
	form := models.ValidInfoRequest{EntityID: entityID}
	response := endpoints.GetEntityInfo(form, mockDepFactory)

	assert.Equal(response.Status, http.StatusOK)
	// and notice down here how we're asserting that the fake data was created
	assert.Equal(response.Response, models.EntityInfoResponse{
		EntityID:   entityID,
		EntityName: "random name",
		IsDocument: false,
		Parent:     repositories.FilesystemRootID,
		Children:   []models.EntityInfoResponse{},
	})
}


// createMockDependencyFactory just constructs an instance of a dependency factory mock
func createMockDependencyFactory(controller *gomock.Controller, mockFileRepo *repMocks.MockIFilesystemRepository, needsLogger bool) *mocks.MockDependencyFactory {
	mockDepFactory := mocks.NewMockDependencyFactory(controller)
	mockDepFactory.EXPECT().GetFilesystemRepo().Return(mockFileRepo)

	if needsLogger {
		log := logger.OpenLog("new log")
		mockDepFactory.EXPECT().GetLogger().Return(log)
	}

	return mockDepFactory
}
```

And thats it! That's how we do testing in the CMS. Our current test suite isn't particularly expansive and thats definitely something we're trying to improve at the moment before we move on to the next team. 