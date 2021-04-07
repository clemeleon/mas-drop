import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Home} from "./pages/home";
import {Header} from "./components/header";
import {Render} from "./components/types";
import {Footer} from "./components/footer";

class App extends Component {
  public render(): Render {
    return (
        <div className="App">
          <Router>
            <Header/>
            <Switch>
              <Route exact path="/">
                {<Home/>}
              </Route>
            </Switch>
            <Footer/>
          </Router>
        </div>
    );
  }
}

export default App;
