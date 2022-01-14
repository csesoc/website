package endpoints

import "net/http"

// Registers the correct decorators for the endpoints too
func RegisterFilesystemEndpoints(mux *http.ServeMux) {
	mux.Handle("/filesystem/info", handler(GetEntityInfo))
	mux.Handle("/filesystem/create", authenticatedHandler(CreateNewEntity))
	mux.Handle("/filesystem/delete", authenticatedHandler(DeleteFilesystemEntity))
	mux.Handle("/filesystem/rename", authenticatedHandler(RenameFilesystemEntity))
	mux.Handle("/filesystem/children", handler(GetChildren))
}
