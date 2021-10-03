package filesystem

import "reflect"

// File just defines models for HTTP requests accepted by the filesystem package

type InfoRequest struct {
	EntityID int `schema:"EntityID,required"`
}

var infoRequest = reflect.TypeOf(InfoRequest{})

type RootInfoRequest struct {
}

var rootInfoRequest = reflect.TypeOf(RootInfoRequest{})

type ValidEntityCreationRequest struct {
	Parent      int    `schema:"Parent,required"`
	LogicalName string `schema:"LogicalName,required"`
	OwnerGroup  int    `schema:"OwnerGroup,required"`
	IsDocument  bool   `schema:"IsDocument,required"`
}

var creationRequest = reflect.TypeOf(ValidEntityCreationRequest{})

type ValidEntityCreationRequestAtRoot struct {
	LogicalName string `schema:"LogicalName,required"`
	OwnerGroup  int    `schema:"OwnerGroup,required"`
	IsDocument  bool   `schema:"IsDocument,required"`
}

var creationRequestRoot = reflect.TypeOf(ValidEntityCreationRequestAtRoot{})

type ValidRenameRequest struct {
	EntityID int    `schema:"EntityID,required"`
	NewName  string `schema:"NewName,required"`
}

var renameRequest = reflect.TypeOf(ValidRenameRequest{})
