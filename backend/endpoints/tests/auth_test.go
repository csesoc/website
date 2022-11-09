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

const TEST_EMAIL = "thomas.liang1@student.unsw.edu.au"
const TEST_PASSWORD = "backendnumberone!"

// Test [endpoints.LoginHandler] succeeds on correct input.
func TestLogin(t *testing.T) {
	form := newTestUser()
	responseRecorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/login", nil)

	// Set up mock-test boilerplate.
	controller := gomock.NewController(t)
	defer controller.Finish()
	mockDependencyFactory := setUpMockRepositories(controller)

	response := endpoints.LoginHandler(form, responseRecorder, request, mockDependencyFactory)

	// The fun happens here!
	const statusCode = http.StatusMovedPermanently
	assert := assert.New(t)
	assert.Equal(statusCode, response.Status)
	// The written status should align with the returned status.
	assert.Equal(statusCode, responseRecorder.Result().StatusCode)
}

func TestLogout(t *testing.T) {
	form := newTestUser()
	loginResponseRecorder := httptest.NewRecorder()
	loginRequest := httptest.NewRequest("POST", "/login", nil)

	// Set up mock-test boilerplate.
	controller := gomock.NewController(t)
	defer controller.Finish()
	mockDependencyFactory := setUpMockRepositories(controller)

	// First, we login.
	loginResponse := endpoints.LoginHandler(form, loginResponseRecorder, loginRequest, mockDependencyFactory)
	// A bit of a hack. Since empty is unexported, it is difficult to get a value of type empty to pass to LogoutHandler.
	empty := loginResponse.Response

	logoutResponseRecorder := httptest.NewRecorder()
	logoutRequest := httptest.NewRequest("POST", "/logout", nil)

	// Pass on the cookies from logging in.
	cookies := logoutResponseRecorder.Result().Cookies()
	for _, cookie := range cookies {
		logoutRequest.AddCookie(cookie)
	}

	logoutResponse := endpoints.LogoutHandler(empty, logoutResponseRecorder, logoutRequest, mockDependencyFactory)

	// The fun happens here!
	const statusCode = http.StatusOK
	assert := assert.New(t)
	assert.Equal(statusCode, logoutResponse.Status)
	assert.Equal(statusCode, logoutResponseRecorder.Result().StatusCode)
}

// Create a dependency factory that contains the user created by [testUser].
func setUpMockRepositories(controller *gomock.Controller) endpoints.DependencyFactory {
	form := newTestUser()
	// LoginHandler queries the person repository of the dependency factory it is given for the user details.
	mockPersonRepository := NewMockIPersonRepository(controller)
	// Fake a repository entry.
	person := repositories.Person {Email: form.Email, Password: form.HashPassword()}
	mockPersonRepository.EXPECT().PersonExists(person).Return(true)
	mockDependencyFactory := NewMockDependencyFactory(controller)
	mockDependencyFactory.EXPECT().GetPersonsRepo().Return(mockPersonRepository)

	return mockDependencyFactory
}

// Create a [User] with the details in [TEST_EMAIL] and [TEST_PASSWORD].
func newTestUser() models.User {
	return models.User {Email: TEST_EMAIL, Password: TEST_PASSWORD}
}
