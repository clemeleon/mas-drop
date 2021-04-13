import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteComponentProps,
  RouteProps,
  match,
  Redirect,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { Render } from "./helpers/types";
import { Footer } from "./components/Footer";
import { Context } from "./components/stores/Store";
import { Carts } from "./pages/Carts";
import { Products } from "./pages/Products";
import OneProduct from "./pages/OneProduct";
import { Error } from "./pages/Error";
import { Auth } from "./helpers/MixFc";
import { User } from "./datas/User";

type ProductParams = { name: string };

type ProductRouteParams = { match?: match<ProductParams> };

type AppProps = {};

type AppStates = {};

class App extends Component<AppProps, AppStates> {
  public static contextType = Context;

  private static product({ match }: ProductRouteParams) {
    if (match) {
      const { params } = match,
        { name } = params;
      if (name.length > 0) {
        return <OneProduct name={name} />;
      }
    }
    return <Redirect to={"/"} />;
  }

  public render(): Render {
    const [{ id, user }] = this.context;
    return (
      <div className="App">
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              {<Home />}
            </Route>
            <Route exact path="/products">
              {<Products />}
            </Route>
            <Route exact path="/product/:name" render={App.product} />
            <Route exact path="/carts">
              <Auth
                lose={false}
                condition={id > 0 && user instanceof User}
                main={<Carts />}
                other={<Error mgs={"Not allowed!"} />}
              />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
