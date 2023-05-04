import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GlobalStore, persistor } from 'src/redux-state/index';
import { PersistGate } from 'redux-persist/integration/react';

// imports
import Dashboard from './packages/dashboard/Dashboard';
import Editor from './packages/editor';
import GlobalStyle from './cse-ui-kit/styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobalStyle />
      <Provider store={GlobalStore}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor/:id" element={<Editor />} />
          </Routes>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
