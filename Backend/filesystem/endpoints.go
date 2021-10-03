package filesystem

import (
	"DiffSync/database"
	"DiffSync/environment"
	_http "DiffSync/http"
	"log"
	"net/http"
)

var httpDBContext database.DatabaseContext
var f _http.FactoryConfig

func init() {
	if environment.IsTestingEnvironment() {
		httpDBContext = database.NewTestingContext()
	} else {
		var err error
		httpDBContext, err = database.NewLiveContext()
		if err != nil {
			log.Print(err.Error())
		}
	}

	// setup endpoint factory
	f = _http.FactoryConfig{
		ErrorsMessages: map[int]string{
			500: "internal server error",
			400: "could not parse HTTP form",
		},
		DBContext: httpDBContext,
	}
}

// RegisterHandlers registers all the filesystem handlers
func RegisterHandlers(mux *http.ServeMux) {
	// Register all the built handlers
	mux.HandleFunc("/filesystem/info", fileInfoHandler)
	mux.HandleFunc("/filesystem/create", entityCreateHandler)
	mux.HandleFunc("/filesystem/delete", entityDeleteHandler)
	mux.HandleFunc("/filesystem/children", getChildrenHandler)
	mux.HandleFunc("/filesystem/rename", renameEntityHandler)
}

// Handler for a request of entity information
var fileInfoHandler = f.BuildEndpointOn(func(ctx _http.DB, p _http.Inp) (_http.Inp, error) {
	return GetFilesystemInfo(ctx, p.(InfoRequest).EntityID)
}, infoRequest).FallsBackTo(func(ctx _http.DB, p _http.Inp) (_http.Inp, error) {
	return GetRootInfo(ctx)
}, rootInfoRequest, f).Accepts(_http.GET)

// Handler for a request to create a new entity
var entityCreateHandler = f.BuildEndpointOn(func(ctx _http.DB, p _http.Inp) (_http.Inp, error) {
	var input = p.(ValidEntityCreationRequest)
	return CreateFilesystemEntity(ctx, input.Parent, input.LogicalName, input.OwnerGroup, input.IsDocument)
}, creationRequest).FallsBackTo(func(ctx _http.DB, p _http.Inp) (_http.Inp, error) {
	var input = p.(ValidEntityCreationRequest)
	return CreateFilesystemEntityAtRoot(ctx, input.LogicalName, input.OwnerGroup, input.IsDocument)
}, creationRequestRoot, f).Accepts(_http.POST)

// Handler to delete an entity
var entityDeleteHandler = f.BuildEndpointOn(func(ctx _http.DB, p _http.Inp) (_http.Inp, error) {
	return p.(InfoRequest).EntityID, DeleteEntity(httpDBContext, p.(InfoRequest).EntityID)
}, infoRequest).OnErrorThrows("failed to delete entity", 500).Accepts(_http.POST)

// Handler to get the children of an etity
var getChildrenHandler = f.BuildEndpointOn(func(ctx _http.DB, p _http.Inp) (_http.Inp, error) {
	return GetEntityChildren(httpDBContext, p.(InfoRequest).EntityID)
}, infoRequest).OnErrorThrows("could not find entity", 404).Accepts(_http.GET)

// Handler to rename an entity
var renameEntityHandler = f.BuildEndpointOn(func(ctx _http.DB, p _http.Inp) (_http.Inp, error) {
	input := p.(ValidRenameRequest)
	return input.EntityID, RenameEntity(httpDBContext, input.EntityID, input.NewName)
}, renameRequest).OnErrorThrows("could not rename entity", 500).Accepts(_http.POST)
