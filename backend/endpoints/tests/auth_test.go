package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"

	"cms.csesoc.unsw.edu.au/endpoints"
	"cms.csesoc.unsw.edu.au/endpoints/models"

	"cms.csesoc.unsw.edu.au/database/repositories"
	. "cms.csesoc.unsw.edu.au/database/repositories/mocks"
	. "cms.csesoc.unsw.edu.au/endpoints/mocks"
)

// Test [endpoints.LoginHandler] succeeds on correct input.
func TestLogin(t *testing.T) {
	form := models.User {Email: "thomas.liang1@student.unsw.edu.au", Password: "backendnumberone"}
	responseRecorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/login", nil)

	// Set up mock-test boilerplate.
	controller := gomock.NewController(t)
	defer controller.Finish()
	// LoginHandler queries the person repository of the dependency factory it is given for the user details.
	mockPersonRepository := NewMockIPersonRepository(controller)
	// Fake a repository entry.
	person := repositories.Person {Email: form.Email, Password: form.HashPassword()}
	mockPersonRepository.EXPECT().PersonExists(person).Return(true)
	mockDependencyFactory := NewMockDependencyFactory(controller)
	mockDependencyFactory.EXPECT().GetPersonsRepo().Return(mockPersonRepository)

	response := endpoints.LoginHandler(form, responseRecorder, request, mockDependencyFactory)

	// The fun happens here!
	const statusCode = http.StatusMovedPermanently
	assert := assert.New(t)
	assert.Equal(statusCode, response.Status)
	// The written status should align with the returned status.
	assert.Equal(statusCode, responseRecorder.Result().StatusCode)
}

func TestLogout(t *testing.T) {
}
