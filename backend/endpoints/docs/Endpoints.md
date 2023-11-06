# Endpoints

Endpoints in the CMS are structured rather differently from endpoints in regular Go applications, CMS endpoints are structured in order to share a lot of common details such as auth and session management between endpoints. The goal was to allow future endpoints to be written in a manner that allowed them to focus PURELY on business logic and not annoying details such as authentication, form parsing and dependency acquisition.

## Creating an Endpoint
To gain a better understanding of how CMS endpoints work we will create a quick endpoint. This endpoint will be a `GET` endpoint that will take a request body of the form:
```json
{
    "ping_count": 10,
    "pong_message": "tomato"
}
```
and will return a response of the form:
```json
{
    "response": "message"
}
```
where `"message"` is the pong message repeated `ping_count` times, ie. the response to the request above would be
```json
{
    "response": "tomatotomatotomatotomatotomatotomatotomatotomatotomatotomato"
}
```
Lets create a handler for this :). The first step is to define a type modelling the input to this http handler, this will look like:
```go
type RequestInput struct {
    PingCount   int     `schema:"ping_count"`
    PongMessage string  `schema:"pong_message"`
}
```
The schema field annotations correspond to what fields in the JSON object correspond to the fields in the Go struct definition. Alongside this input type we must also define an output type
```go
type RequestResponse struct {
    Response    string  `schema:"response"`
}
```
Now that we have both our input and output types we can now define our handler. HTTP handlers take an input form alongside a "dependency factory" (more on this later) as arguments and output a specialized `handlerResponse` type.
```go
func RequestHandler(form RequestInput, df DependencyFactory) handlerResponse[RequestResponse] {

}
```
The framework automatically handles the deserialization of the request input and serialization of our output, allowing us to focus entirely on business logic. All thats left for us to do now is define our business logic.
```go
func RequestHandler(form RequestInput, df DependencyFactory) handlerResponse[RequestResponse] {
    response := strings.Builder{}

    for i := 0; i < form.PingCount; i++ {
        response.WriteString(form.PongMessage)
    }

    return handlerResponse[RequestResponse]{
        Status: http.StatusOk,
        Response: RequestResponse {
            Response: response.String()
        }
    }
}
```
Note that when writing this handler we didnt need to worry about any of the usual things we would be concerned with in Go, the inputs and outputs are "automagically" converted to/from JSON for us.

Now that the core handler logic has been created we must now register it and map it to and endpoint. Endpoints are registered within `registration.go`, there are 3 possible registration types we can apply to an endpoint:
 - Regular
    - Regular handlers simply take the input form as an argument and a dependency factory. There is no authentication blocking access to these handlers.
 - Authenticated
    - These handlers are like regular handlers except they require authentication to access. 
 - Raw
    - These are a special type of handler used when your business logic requires access to raw `http.request` and `http.response` values, one obvious example is any handler that upgrades HTTP requests to a websocket connection.

For our simple endpoint we will go with a regular handler. We can register it like so:
```go
mux.Handle("/ping", newHandler("GET", RequestHandler, /* isMultipart = */ false))
```
You may have noticed the weird `isMultipart` field, this field indicates if the request accepts multipart values (ie. Images, Videos, etc). An example of such an endpoint is `/api/filesystem/upload-image`.

## Endpoint Configurations
As mentioned earlier, there are quite a few ways to configure and customise your endpoint. The main ones being regular/authenticated and raw endpoints. There are however a few more options.
 - Regular Handlers, Raw Handlers, Authenticated Handlers
    - Each of these handler types support multipart requests, these were discussed earlier
 - Authenticated / Unauthenticated raw handlers
    - As a leak in the abstraction provided by our endpoint framework, raw handlers require a boolean flag indicating if they require authentication.
 - Raw handlers / isWebsocket
    - this configuration indicates if you intend to use the handler to upgrade HTTP connections to websocket connections, once again this is a good example of a leaky abstraction which should be refactored out
    - the reason we care is because once connections are upgraded to websocket connections the framework must know that it can no longer write data to the corresponding request/response values.




## Dependencies & Inversion of Control
The way the framework deals with dependencies is by disallowing handlers to instantiate dependencies themselves, instead handlers must fetch dependencies from the `dependencyFactory` thats passed to them as an argument. The `DependencyFactory` is merely a simple interface with the definition:
```go
type DependencyFactory interface {
	GetFilesystemRepo() repos.FilesystemRepository
	GetGroupsRepo() repos.GroupsRepository
	GetFrontendsRepo() repos.FrontendsRepository
	GetPersonsRepo() repos.PersonRepository

	GetUnpublishedVolumeRepo() repos.UnpublishedVolumeRepository
	GetPublishedVolumeRepo() repos.PublishedVolumeRepository

	GetLogger() *logger.Log
}
```
the interface exposes a bunch of methods to acquire specific database repositories as well as stuff like loggers. The advantage of writing handlers in such a way is that it makes testing them really simple, we can employ simple mocking strategies to effectively unit test handlers, it also allows us to abstract over details such as what filesystem we may actually be looking at. Doing so allows endpoint handlers to be written without a concern of what filesystem/frontend we're looking at as those details are abstracted away by the factory.