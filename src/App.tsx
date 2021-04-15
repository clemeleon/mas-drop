import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
import { Auth, Conditional } from "./helpers/MixFc";
import { User } from "./datas/User";
import { Login } from "./pages/Login";

export type ProductParams = { [key: string]: any };

export type ProductRouteParams = { match?: match<ProductParams> };

type AppProps = {};

type AppStates = {};

class App extends Component<AppProps, AppStates> {
  public static contextType = Context;

  private static conditional(
    { match }: ProductRouteParams,
    action: ({ name }: ProductParams) => Render,
    names: string[]
  ) {
    return (
      <Conditional
        uri={match?.url ?? ""}
        params={match?.params ?? {}}
        names={names}
        action={action}
      />
    );
  }

  public render(): Render {
    const [{ id, user }] = this.context;
    return (
      <div className="App">
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              <Auth
                lose={false}
                condition={id > 0 && user instanceof User}
                main={<Home />}
                other={<Login />}
              />
            </Route>
            <Route exact path="/products">
              {<Products />}
            </Route>
            <Route
              exact
              path="/product/:name"
              render={(props) =>
                App.conditional(
                  props,
                  ({ name }: ProductParams): Render => {
                    return <OneProduct name={name} />;
                  },
                  ["name"]
                )
              }
            />
            <Route exact path="/carts">
              <Auth
                lose={false}
                condition={id > 0 && user instanceof User}
                main={<Carts />}
                other={<Redirect to={"/"} />}
              />
            </Route>
            <Route>
              <Error mgs={"404 Page not found!!"} />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
