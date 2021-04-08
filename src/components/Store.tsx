import React, { Component } from "react";
import { StoreProps, StoreStates, StoreItem } from "../helpers/types";

const Def: StoreItem = { carts: [] },
  Context = React.createContext<StoreItem>(Def),
  { Provider, Consumer } = Context;

class Store extends Component<StoreProps, StoreStates> {
  private key: string = "state";

  public constructor(props: StoreProps) {
    super(props);
    try {
      const str = localStorage.getItem(this.key),
        carts = str && str.length > 0 ? JSON.parse(str) : {};
      this.state = { ...carts };
    } catch (e) {}
  }

  public componentDidMount() {
    const { carts } = this.state;
    if (!carts || carts.length === 0) {
      fetch("https://fakestoreapi.com/carts", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((res) => {
          res.json().then((datas) => {
            if (Array.isArray(datas)) {
              console.log(datas);
              this.set("carts", datas);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public render() {
    const { children } = this.props;
    return (
      <Provider
        value={{
          get: (key: string, def: StoreItem): StoreItem => this.get(key, def),
          pick: (keys: StoreItem): StoreItem => {
            const datas: StoreItem = {};
            for (const [key, val] of Object.entries(keys)) {
              Object.assign(datas, { [key]: this.get(key, val) });
            }
            return datas;
          },
          set: (key: string, val: StoreItem): void => this.set(key, val),
        }}
      >
        {children}
      </Provider>
    );
  }

  private get = (key: string, def: StoreItem): StoreItem => {
    for (const [name, val] of Object.entries(this.state)) {
      if (name === key) {
        return val;
      }
    }
    return def;
  };

  shouldComponentUpdate(
    nextProps: Readonly<StoreProps>,
    nextState: Readonly<StoreStates>,
    nextContext: any
  ): boolean {
    if (this.state !== nextState) {
      try {
        localStorage.setItem("state", JSON.stringify(nextState));
        //return true;
      } catch (e) {}
    }
    return false;
  }

  private set = (key: string, val: StoreItem): void => {
    this.setState((preState) => {
      const old = this.get(key, "");
      if (val && old !== val) {
        return { ...preState, ...{ [key]: val } };
      }
      return preState;
    });
  };
}

export { Store, Consumer as StoreConsumer, Context as StoreContext };
