package endpoints

import "net/http"

// Registers the correct decorators for the endpoints too
func RegisterFilesystemEndpoints(mux *http.ServeMux) {
	mux.Handle("/filesystem/info", handler(GetEntityInfo))
	mux.Handle("/filesystem/create", handler(CreateNewEntity))
	mux.Handle("/filesystem/delete", handler(DeleteFilesystemEntity))
	mux.Handle("/filesystem/rename", handler(RenameFilesystemEntity))
	mux.Handle("/filesystem/children", handler(GetChildren))
}
