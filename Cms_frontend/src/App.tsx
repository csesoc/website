import React from 'react';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './css/styles.css'


const App: React.FC = () => {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
