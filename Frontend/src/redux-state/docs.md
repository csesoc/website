## Top level global redux store

Reduces the state slices into 1 global redux storage.

### How do we use redux here at CSE Websites?

Our Redux is primarily built using a package called `redux-toolkit` and utilises its capabilities, namely these four main functions
- CombineReducers
- ConfigureStore
- CreateReducers
- createAction

Furthermore, we utilise a middleware called `redux-sagas` to handle asynchronous side effects such as API calls, which result in a redux action which has been triggered, by user interaction

