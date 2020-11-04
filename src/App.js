import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

//Style sheets
import './css/bootstrap.min.css'
import './css/main.css'
import './css/normalize.css'
import './css/scrumonline.css'

//components
import NoExiste from './components/noexiste'
import GitHub from './components/github'
import NavBar from './components/navbar'
import Impressum from './components/impressum'
import Instructions from './components/instructions'
import Sessions from './components/sessions'
import Home from './components/home'
import Session from './components/session'
import Member from './components/member'
import Join from './components/join'

const App = () => {
  return (
    <Router>
      <Fragment>
        <GitHub />
        <NavBar />
        <div className="container-fluid main">
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/member/:idsession/:idmember">
              <Member />
            </Route>
            <Route path="/join/:idsession">
              <Join />
            </Route>
            <Route path="/session/:idsession">
              <Session />
            </Route>
            <Route path="/sessions">
              <Sessions />
            </Route>
            <Route path="/instructions">
              <Instructions />
            </Route>
            <Route path="/impressum">
              <Impressum />
            </Route>
            <Route path="/">
              <NoExiste />
            </Route>
          </Switch>
        </div>
      </Fragment>
    </Router>
  );
}

export default App;
