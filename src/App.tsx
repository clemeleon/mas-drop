import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { Render } from "./helpers/types";
import { Footer } from "./components/Footer";
import { StoreContext } from "./components/Store";

class App extends Component {
  static contextType = StoreContext;
  public render(): Render {
    //this.context.set("test", "wow");
    //console.log(this.context.get("carts"));
    console.log(this.context);
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
