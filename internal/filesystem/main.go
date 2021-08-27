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
