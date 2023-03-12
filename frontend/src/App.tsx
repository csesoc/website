import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { GlobalStore } from "src/redux-state/index";

// imports
import Dashboard from './packages/dashboard/Dashboard';
import Editor from './packages/editor';
import GlobalStyle from './cse-ui-kit/styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobalStyle />
      <Provider store={GlobalStore}>
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/editor/:id" element={<Editor/>}/>
          </Routes>
      </Provider>
    </div>
  );
};

export default App;
