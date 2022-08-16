package tests

import (
	"bytes"
	"encoding/base64"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"testing"

	"cms.csesoc.unsw.edu.au/endpoints"
	"github.com/stretchr/testify/assert"
)

type (
	NormalRequest struct {
		A string
		B string
	}

	MultipartRequest struct {
		A    string
		File multipart.File
	}
)

func TestParsesNormalPostForm(t *testing.T) {
	assert := assert.New(t)

	q := url.Values{}
	q.Add("A", "string a")
	q.Add("B", "string b")
	req, _ := http.NewRequest("POST", "/filesystem/info", strings.NewReader(q.Encode()))

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Content-Length", strconv.Itoa(len(q.Encode())))

	response := NormalRequest{}
	endpoints.ParseParamsToSchema(req, "POST", &response)

	assert.Equal(response.A, "string a")
	assert.Equal(response.B, "string b")
}

func TestParsesNormalGetForm(t *testing.T) {
	assert := assert.New(t)

	req, _ := http.NewRequest("GET", "/filesystem/info", nil)
	q := req.URL.Query()
	q.Add("A", "string a")
	q.Add("B", "string b")

	req.URL.RawQuery = q.Encode()
	response := NormalRequest{}
	endpoints.ParseParamsToSchema(req, "GET", &response)

	assert.Equal(response.A, "string a")
	assert.Equal(response.B, "string b")
}

func TestParsesMultipartForm(t *testing.T) {
	assert := assert.New(t)

	// Create request
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)

	part, _ := writer.CreateFormFile("File", "a.png")
	base64Png := "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
	pngBytes, _ := base64.StdEncoding.DecodeString(base64Png)
	part.Write(pngBytes)

	writer.WriteField("A", "string a")
	writer.Close()
	req, _ := http.NewRequest("POST", "/filesystem/image-upload", body)
	req.Header.Add("Content-Type", writer.FormDataContentType())

	// pass it to a form parser
	response := MultipartRequest{}
	endpoints.ParseMultiPartFormToSchema(req, "POST", &response)

	assert.Equal(response.A, "string a")

	// Read everything from the file :O
	defer response.File.Close()
	contents, _ := ioutil.ReadAll(response.File)
	assert.Equal(contents, []byte(pngBytes))
}
