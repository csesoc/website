package endpoints

import "net/http"

// Registers the correct decorators for the endpoints too
func RegisterFilesystemEndpoints(mux *http.ServeMux) {
	mux.Handle("/api/filesystem/info", newHandler("GET", GetEntityInfo, false))
	mux.Handle("/api/filesystem/create", newHandler("POST", CreateNewEntity, false))        // auth
	mux.Handle("/api/filesystem/delete", newHandler("POST", DeleteFilesystemEntity, false)) // auth
	mux.Handle("/api/filesystem/rename", newHandler("POST", RenameFilesystemEntity, false)) // auth
	mux.Handle("/api/filesystem/children", newHandler("GET", GetChildren, false))
	mux.Handle("/api/filesystem/upload-image", newHandler("POST", UploadImage, true))           // auth
	mux.Handle("/api/filesystem/upload-document", newHandler("POST", UploadDocument, false))    // auth
	mux.Handle("/api/filesystem/publish-document", newHandler("POST", PublishDocument, false))  // auth
	mux.Handle("/api/filesystem/get/published", newHandler("GET", GetPublishedDocument, false)) // auth
}

// Registers the authentication based endpoints
func RegisterAuthenticationEndpoints(mux *http.ServeMux) {
	mux.Handle("/login", newRawHandler("POST", LoginHandler, false, false, false))
	mux.Handle("/logout", newRawHandler("POST", LogoutHandler, false, false, false)) // auth
}

// Registers the editor related endpoints
func RegisterEditorEndpoints(mux *http.ServeMux) {
	mux.Handle("/editor", newRawHandler("GET", EditHandler, false, false, true)) // auth
}

// newHandler is just a small wrapper around a handler that returns an instance of a handler struct
func newHandler[T, V any](formType string, handlerFunc func(T, DependencyFactory) handlerResponse[V], isMultipart bool) handler[T, V] {
	return handler[T, V]{
		FormType:    formType,
		Handler:     handlerFunc,
		IsMultipart: isMultipart,
	}
}

// newAuthenticatedHandler is just a small wrapper around a handler that returns an instance of a authenticatedHandler struct
func newAuthenticatedHandler[T, V any](formType string, handler func(T, DependencyFactory) handlerResponse[V], isMultipart bool) authenticatedHandler[T, V] {
	return authenticatedHandler[T, V]{
		FormType:    formType,
		Handler:     handler,
		IsMultipart: isMultipart,
	}
}

// newRawHandler is like the other instantiation functions except it returns an instance of a raw handler (see documentation)
func newRawHandler[T, V any](formType string, handler func(form T, w http.ResponseWriter, r *http.Request, dependencyFactory DependencyFactory) (response handlerResponse[V]), isMultipart bool, needsAuth bool, isWebsocket bool) rawHandler[T, V] {
	return rawHandler[T, V]{
		FormType:    formType,
		Handler:     handler,
		IsMultipart: isMultipart,
		IsWebsocket: isWebsocket,
	}
}
