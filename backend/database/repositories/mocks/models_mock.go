// Code generated by MockGen. DO NOT EDIT.
// Source: models.go

// Package mocks is a generated GoMock package.
package mocks

import (
	os "os"
	reflect "reflect"

	contexts "cms.csesoc.unsw.edu.au/database/contexts"
	repositories "cms.csesoc.unsw.edu.au/database/repositories"
	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockIFilesystemRepository is a mock of IFilesystemRepository interface.
type MockIFilesystemRepository struct {
	ctrl     *gomock.Controller
	recorder *MockIFilesystemRepositoryMockRecorder
}

// MockIFilesystemRepositoryMockRecorder is the mock recorder for MockIFilesystemRepository.
type MockIFilesystemRepositoryMockRecorder struct {
	mock *MockIFilesystemRepository
}

// NewMockIFilesystemRepository creates a new mock instance.
func NewMockIFilesystemRepository(ctrl *gomock.Controller) *MockIFilesystemRepository {
	mock := &MockIFilesystemRepository{ctrl: ctrl}
	mock.recorder = &MockIFilesystemRepositoryMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockIFilesystemRepository) EXPECT() *MockIFilesystemRepositoryMockRecorder {
	return m.recorder
}

// CreateEntry mocks base method.
func (m *MockIFilesystemRepository) CreateEntry(file repositories.FilesystemEntry) (repositories.FilesystemEntry, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateEntry", file)
	ret0, _ := ret[0].(repositories.FilesystemEntry)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateEntry indicates an expected call of CreateEntry.
func (mr *MockIFilesystemRepositoryMockRecorder) CreateEntry(file interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateEntry", reflect.TypeOf((*MockIFilesystemRepository)(nil).CreateEntry), file)
}

// DeleteEntryWithID mocks base method.
func (m *MockIFilesystemRepository) DeleteEntryWithID(ID uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteEntryWithID", ID)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteEntryWithID indicates an expected call of DeleteEntryWithID.
func (mr *MockIFilesystemRepositoryMockRecorder) DeleteEntryWithID(ID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteEntryWithID", reflect.TypeOf((*MockIFilesystemRepository)(nil).DeleteEntryWithID), ID)
}

// GetContext mocks base method.
func (m *MockIFilesystemRepository) GetContext() contexts.DatabaseContext {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetContext")
	ret0, _ := ret[0].(contexts.DatabaseContext)
	return ret0
}

// GetContext indicates an expected call of GetContext.
func (mr *MockIFilesystemRepositoryMockRecorder) GetContext() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetContext", reflect.TypeOf((*MockIFilesystemRepository)(nil).GetContext))
}

// GetEntryWithID mocks base method.
func (m *MockIFilesystemRepository) GetEntryWithID(ID uuid.UUID) (repositories.FilesystemEntry, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntryWithID", ID)
	ret0, _ := ret[0].(repositories.FilesystemEntry)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntryWithID indicates an expected call of GetEntryWithID.
func (mr *MockIFilesystemRepositoryMockRecorder) GetEntryWithID(ID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntryWithID", reflect.TypeOf((*MockIFilesystemRepository)(nil).GetEntryWithID), ID)
}

// GetEntryWithParentID mocks base method.
func (m *MockIFilesystemRepository) GetEntryWithParentID(ID uuid.UUID) (repositories.FilesystemEntry, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntryWithParentID", ID)
	ret0, _ := ret[0].(repositories.FilesystemEntry)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntryWithParentID indicates an expected call of GetEntryWithParentID.
func (mr *MockIFilesystemRepositoryMockRecorder) GetEntryWithParentID(ID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntryWithParentID", reflect.TypeOf((*MockIFilesystemRepository)(nil).GetEntryWithParentID), ID)
}

// GetIDWithPath mocks base method.
func (m *MockIFilesystemRepository) GetIDWithPath(path string) (uuid.UUID, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetIDWithPath", path)
	ret0, _ := ret[0].(uuid.UUID)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetIDWithPath indicates an expected call of GetIDWithPath.
func (mr *MockIFilesystemRepositoryMockRecorder) GetIDWithPath(path interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetIDWithPath", reflect.TypeOf((*MockIFilesystemRepository)(nil).GetIDWithPath), path)
}

// GetRoot mocks base method.
func (m *MockIFilesystemRepository) GetRoot() (repositories.FilesystemEntry, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetRoot")
	ret0, _ := ret[0].(repositories.FilesystemEntry)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetRoot indicates an expected call of GetRoot.
func (mr *MockIFilesystemRepositoryMockRecorder) GetRoot() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetRoot", reflect.TypeOf((*MockIFilesystemRepository)(nil).GetRoot))
}

// RenameEntity mocks base method.
func (m *MockIFilesystemRepository) RenameEntity(ID uuid.UUID, name string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "RenameEntity", ID, name)
	ret0, _ := ret[0].(error)
	return ret0
}

// RenameEntity indicates an expected call of RenameEntity.
func (mr *MockIFilesystemRepositoryMockRecorder) RenameEntity(ID, name interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "RenameEntity", reflect.TypeOf((*MockIFilesystemRepository)(nil).RenameEntity), ID, name)
}

// MockIUnpublishedVolumeRepository is a mock of IUnpublishedVolumeRepository interface.
type MockIUnpublishedVolumeRepository struct {
	ctrl     *gomock.Controller
	recorder *MockIUnpublishedVolumeRepositoryMockRecorder
}

// MockIUnpublishedVolumeRepositoryMockRecorder is the mock recorder for MockIUnpublishedVolumeRepository.
type MockIUnpublishedVolumeRepositoryMockRecorder struct {
	mock *MockIUnpublishedVolumeRepository
}

// NewMockIUnpublishedVolumeRepository creates a new mock instance.
func NewMockIUnpublishedVolumeRepository(ctrl *gomock.Controller) *MockIUnpublishedVolumeRepository {
	mock := &MockIUnpublishedVolumeRepository{ctrl: ctrl}
	mock.recorder = &MockIUnpublishedVolumeRepositoryMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockIUnpublishedVolumeRepository) EXPECT() *MockIUnpublishedVolumeRepositoryMockRecorder {
	return m.recorder
}

// AddToVolume mocks base method.
func (m *MockIUnpublishedVolumeRepository) AddToVolume(filename string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AddToVolume", filename)
	ret0, _ := ret[0].(error)
	return ret0
}

// AddToVolume indicates an expected call of AddToVolume.
func (mr *MockIUnpublishedVolumeRepositoryMockRecorder) AddToVolume(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AddToVolume", reflect.TypeOf((*MockIUnpublishedVolumeRepository)(nil).AddToVolume), filename)
}

// CopyToVolume mocks base method.
func (m *MockIUnpublishedVolumeRepository) CopyToVolume(src *os.File, filename string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CopyToVolume", src, filename)
	ret0, _ := ret[0].(error)
	return ret0
}

// CopyToVolume indicates an expected call of CopyToVolume.
func (mr *MockIUnpublishedVolumeRepositoryMockRecorder) CopyToVolume(src, filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CopyToVolume", reflect.TypeOf((*MockIUnpublishedVolumeRepository)(nil).CopyToVolume), src, filename)
}

// DeleteFromVolume mocks base method.
func (m *MockIUnpublishedVolumeRepository) DeleteFromVolume(filename string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteFromVolume", filename)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteFromVolume indicates an expected call of DeleteFromVolume.
func (mr *MockIUnpublishedVolumeRepositoryMockRecorder) DeleteFromVolume(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteFromVolume", reflect.TypeOf((*MockIUnpublishedVolumeRepository)(nil).DeleteFromVolume), filename)
}

// GetFromVolume mocks base method.
func (m *MockIUnpublishedVolumeRepository) GetFromVolume(filename string) (*os.File, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetFromVolume", filename)
	ret0, _ := ret[0].(*os.File)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetFromVolume indicates an expected call of GetFromVolume.
func (mr *MockIUnpublishedVolumeRepositoryMockRecorder) GetFromVolume(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetFromVolume", reflect.TypeOf((*MockIUnpublishedVolumeRepository)(nil).GetFromVolume), filename)
}

// GetFromVolumeTruncated mocks base method.
func (m *MockIUnpublishedVolumeRepository) GetFromVolumeTruncated(filename string) (*os.File, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetFromVolumeTruncated", filename)
	ret0, _ := ret[0].(*os.File)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetFromVolumeTruncated indicates an expected call of GetFromVolumeTruncated.
func (mr *MockIUnpublishedVolumeRepositoryMockRecorder) GetFromVolumeTruncated(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetFromVolumeTruncated", reflect.TypeOf((*MockIUnpublishedVolumeRepository)(nil).GetFromVolumeTruncated), filename)
}

// MockIPublishedVolumeRepository is a mock of IPublishedVolumeRepository interface.
type MockIPublishedVolumeRepository struct {
	ctrl     *gomock.Controller
	recorder *MockIPublishedVolumeRepositoryMockRecorder
}

// MockIPublishedVolumeRepositoryMockRecorder is the mock recorder for MockIPublishedVolumeRepository.
type MockIPublishedVolumeRepositoryMockRecorder struct {
	mock *MockIPublishedVolumeRepository
}

// NewMockIPublishedVolumeRepository creates a new mock instance.
func NewMockIPublishedVolumeRepository(ctrl *gomock.Controller) *MockIPublishedVolumeRepository {
	mock := &MockIPublishedVolumeRepository{ctrl: ctrl}
	mock.recorder = &MockIPublishedVolumeRepositoryMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockIPublishedVolumeRepository) EXPECT() *MockIPublishedVolumeRepositoryMockRecorder {
	return m.recorder
}

// AddToVolume mocks base method.
func (m *MockIPublishedVolumeRepository) AddToVolume(filename string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AddToVolume", filename)
	ret0, _ := ret[0].(error)
	return ret0
}

// AddToVolume indicates an expected call of AddToVolume.
func (mr *MockIPublishedVolumeRepositoryMockRecorder) AddToVolume(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AddToVolume", reflect.TypeOf((*MockIPublishedVolumeRepository)(nil).AddToVolume), filename)
}

// CopyToVolume mocks base method.
func (m *MockIPublishedVolumeRepository) CopyToVolume(src *os.File, filename string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CopyToVolume", src, filename)
	ret0, _ := ret[0].(error)
	return ret0
}

// CopyToVolume indicates an expected call of CopyToVolume.
func (mr *MockIPublishedVolumeRepositoryMockRecorder) CopyToVolume(src, filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CopyToVolume", reflect.TypeOf((*MockIPublishedVolumeRepository)(nil).CopyToVolume), src, filename)
}

// DeleteFromVolume mocks base method.
func (m *MockIPublishedVolumeRepository) DeleteFromVolume(filename string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteFromVolume", filename)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteFromVolume indicates an expected call of DeleteFromVolume.
func (mr *MockIPublishedVolumeRepositoryMockRecorder) DeleteFromVolume(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteFromVolume", reflect.TypeOf((*MockIPublishedVolumeRepository)(nil).DeleteFromVolume), filename)
}

// GetFromVolume mocks base method.
func (m *MockIPublishedVolumeRepository) GetFromVolume(filename string) (*os.File, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetFromVolume", filename)
	ret0, _ := ret[0].(*os.File)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetFromVolume indicates an expected call of GetFromVolume.
func (mr *MockIPublishedVolumeRepositoryMockRecorder) GetFromVolume(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetFromVolume", reflect.TypeOf((*MockIPublishedVolumeRepository)(nil).GetFromVolume), filename)
}

// GetFromVolumeTruncated mocks base method.
func (m *MockIPublishedVolumeRepository) GetFromVolumeTruncated(filename string) (*os.File, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetFromVolumeTruncated", filename)
	ret0, _ := ret[0].(*os.File)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetFromVolumeTruncated indicates an expected call of GetFromVolumeTruncated.
func (mr *MockIPublishedVolumeRepositoryMockRecorder) GetFromVolumeTruncated(filename interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetFromVolumeTruncated", reflect.TypeOf((*MockIPublishedVolumeRepository)(nil).GetFromVolumeTruncated), filename)
}

// MockIPersonRepository is a mock of IPersonRepository interface.
type MockIPersonRepository struct {
	ctrl     *gomock.Controller
	recorder *MockIPersonRepositoryMockRecorder
}

// MockIPersonRepositoryMockRecorder is the mock recorder for MockIPersonRepository.
type MockIPersonRepositoryMockRecorder struct {
	mock *MockIPersonRepository
}

// NewMockIPersonRepository creates a new mock instance.
func NewMockIPersonRepository(ctrl *gomock.Controller) *MockIPersonRepository {
	mock := &MockIPersonRepository{ctrl: ctrl}
	mock.recorder = &MockIPersonRepositoryMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockIPersonRepository) EXPECT() *MockIPersonRepositoryMockRecorder {
	return m.recorder
}

// GetPersonWithDetails mocks base method.
func (m *MockIPersonRepository) GetPersonWithDetails(arg0 repositories.Person) repositories.Person {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetPersonWithDetails", arg0)
	ret0, _ := ret[0].(repositories.Person)
	return ret0
}

// GetPersonWithDetails indicates an expected call of GetPersonWithDetails.
func (mr *MockIPersonRepositoryMockRecorder) GetPersonWithDetails(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetPersonWithDetails", reflect.TypeOf((*MockIPersonRepository)(nil).GetPersonWithDetails), arg0)
}

// PersonExists mocks base method.
func (m *MockIPersonRepository) PersonExists(arg0 repositories.Person) bool {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "PersonExists", arg0)
	ret0, _ := ret[0].(bool)
	return ret0
}

// PersonExists indicates an expected call of PersonExists.
func (mr *MockIPersonRepositoryMockRecorder) PersonExists(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "PersonExists", reflect.TypeOf((*MockIPersonRepository)(nil).PersonExists), arg0)
}

// MockIGroupsRepository is a mock of IGroupsRepository interface.
type MockIGroupsRepository struct {
	ctrl     *gomock.Controller
	recorder *MockIGroupsRepositoryMockRecorder
}

// MockIGroupsRepositoryMockRecorder is the mock recorder for MockIGroupsRepository.
type MockIGroupsRepositoryMockRecorder struct {
	mock *MockIGroupsRepository
}

// NewMockIGroupsRepository creates a new mock instance.
func NewMockIGroupsRepository(ctrl *gomock.Controller) *MockIGroupsRepository {
	mock := &MockIGroupsRepository{ctrl: ctrl}
	mock.recorder = &MockIGroupsRepositoryMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockIGroupsRepository) EXPECT() *MockIGroupsRepositoryMockRecorder {
	return m.recorder
}

// GetGroupInfo mocks base method.
func (m *MockIGroupsRepository) GetGroupInfo(arg0 repositories.Groups) repositories.Groups {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetGroupInfo", arg0)
	ret0, _ := ret[0].(repositories.Groups)
	return ret0
}

// GetGroupInfo indicates an expected call of GetGroupInfo.
func (mr *MockIGroupsRepositoryMockRecorder) GetGroupInfo(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetGroupInfo", reflect.TypeOf((*MockIGroupsRepository)(nil).GetGroupInfo), arg0)
}
