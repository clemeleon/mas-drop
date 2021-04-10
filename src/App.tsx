import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { Render } from "./helpers/types";
import { Footer } from "./components/Footer";
import { StoreContext } from "./components/stores/Store";

class App extends Component {
  public static contextType = StoreContext;
  public render(): Render {
    return (
      <div className="App">
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              {<Home />}
            </Route>
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
