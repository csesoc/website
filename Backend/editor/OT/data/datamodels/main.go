package datamodels

// DataModel is an interface that all wannabe datamodels must implement,
// for now the only required method is IsExposed(), the point of the interface
// is to prevent accidentally providing non-registered types into the CMS
type DataModel interface {
	IsExposed() bool
}
