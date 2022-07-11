package storage

import (
	"bytes"
	"fmt"
	"go/build"
	"os"
)

func Read(id, dir string) string {
	// super insecure but who cares? issa prototype
	gopath := build.Default.GOPATH
	file, err := os.Open(fmt.Sprintf("%s/src/cms.csesoc.unsw.edu.au/internal/%s/%s", gopath, dir, id))
	defer file.Close()

	if err != nil {
		panic(err)
	}
	fileBuffer := new(bytes.Buffer)
	fileBuffer.ReadFrom(file)

	return fileBuffer.String()
}

// pretty pleasee close ur file pointers owo, meant to override file contents
func Open(id, dir string) (*os.File, error) {
	file, err := os.Create(fmt.Sprintf("storage/%s", id))
	return file, err
}
