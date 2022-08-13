package endpoints

import "net/http"

// Registers the correct decorators for the endpoints too
func RegisterFilesystemEndpoints(mux *http.ServeMux) {
	mux.Handle("/api/filesystem/info", handler(GetEntityInfo))
	mux.Handle("/api/filesystem/create", handler(CreateNewEntity))        // auth
	mux.Handle("/api/filesystem/delete", handler(DeleteFilesystemEntity)) // auth
	mux.Handle("/api/filesystem/rename", handler(RenameFilesystemEntity)) // auth
	mux.Handle("/api/filesystem/children", handler(GetChildren))
	mux.Handle("/api/filesystem/upload-image", handler(UploadImage))           // auth
	mux.Handle("/api/filesystem/publish-document", handler(PublishDocument))   // auth
	mux.Handle("/api/filesystem/get/published", handler(GetPublishedDocument)) // auth
}

// Registers the authentication based endpoints
func RegisterAuthenticationEndpoints(mux *http.ServeMux) {
	mux.Handle("/login", handler(LoginHandler))
	mux.Handle("/logout", handler(LogoutHandler)) // auth
}

// Registers the editor related endpoints
func RegisterEditorEndpoints(mux *http.ServeMux) {
	mux.Handle("/editor", handler(EditHandler)) // auth
}
