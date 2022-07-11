# Backend

The backend folder contains all our backend code 🤯. Theres a few important folders:
 - ### `database/`
   - Package contains all database specific code (basically just contexts + repositories)
   - Repositories are repositories, just provide methods for interacting with the database
   - Contexts are actual database connections, theres a `testing_context` and a normal `live_context`, the `testing_context` wraps all SQL queries in a transaction and rolls them back once testing has finished and `live_context` does nothing special 🙁
 - ### `endpoints/`
   - Contains all our HTTP handlers + methods for decorating those handlers, additionally provides methods for attaching handlers to a `http.ServeMux`
 - ### `editor/`
   - Contains all the backend code for synchronisation (bit of a mess right now 😭). It is essentially just a big implementation for the differential sync algorithm and supports extension via the construction of `extensions`
   - The package allows multiple clients to be connected to the same document and ensures that each client sees the exact same document state (via a best effort diff + patch)
   - Currently only works on strings with no inheret structure but in the future will work on JSON documents too 😀 
 - ### `algorithms/`
   - Mostly algorithms used by the editor such as Myer's string difference algorithm (glorified BFS tbh) and some prefix/suffix computation
 - ### `environment/` & `internal/`
   - Methods/packages that can be used to retrieve information about the current environment and other internal utilities 
