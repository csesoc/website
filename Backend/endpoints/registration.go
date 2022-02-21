package endpoints

import "net/http"

// Registers the correct decorators for the endpoints too
func RegisterFilesystemEndpoints(mux *http.ServeMux) {
	mux.Handle("/filesystem/info", handler(GetEntityInfo))
	mux.Handle("/filesystem/create", handler(CreateNewEntity))        //auth
	mux.Handle("/filesystem/delete", handler(DeleteFilesystemEntity)) //auth
	mux.Handle("/filesystem/rename", handler(RenameFilesystemEntity)) //auth
	mux.Handle("/filesystem/children", handler(GetChildren))
}

// Registers the authentication based endpoints
func RegisterAuthenticationEndpoints(mux *http.ServeMux) {
	mux.Handle("/login", handler(LoginHandler))
	mux.Handle("/logout", handler(LogoutHandler)) // auth
}
