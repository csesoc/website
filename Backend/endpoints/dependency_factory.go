package endpoints

//go:generate mockgen -source=dependency_factory.go -destination=mocks/dependency_factory_mock.go -package=mocks

import (
	"reflect"

	"cms.csesoc.unsw.edu.au/database/repositories"
)

// DependencyFactory is an interface type that handlers can use to retrieve
// and fetch specific dependencies
type DependencyFactory interface {
	GetDependency(t reflect.Type) interface{}
}

type DependencyProvider struct{}

// TODO: when generics are released in Go 18 or Go 20 then make this
// method not reflection hell
func (DependencyProvider) GetDependency(t reflect.Type) interface{} {
	switch t {
	case reflect.TypeOf((*repositories.IFilesystemRepository)(nil)):
		return repositories.GetRepository(repositories.FILESYSTEM)
	case reflect.TypeOf((*repositories.IGroupsRepository)(nil)):
		return repositories.GetRepository(repositories.GROUPS)
	case reflect.TypeOf((*repositories.IPersonRepository)(nil)):
		return repositories.GetRepository(repositories.PERSON)
	case reflect.TypeOf((*repositories.IDockerUnpublishedFilesystemRepository)(nil)):
		return repositories.GetRepository(repositories.DOCKER_UNPUBLISHED_FILESYSTEM)
	case reflect.TypeOf((*repositories.IDockerPublishedFilesystemRepository)(nil)):
		return repositories.GetRepository(repositories.DOCKER_PUBLISHED_FILESYSTEM)
	default:
		panic("unsupported dependency requested")
	}
}
