package filesystem

import (
	"bytes"
	"fmt"
	"os"
)

func Read(id, dir string) string {
	// super insecure but who cares? issa prototype
	file, err := os.Open(fmt.Sprintf("storage/%s", id))
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
