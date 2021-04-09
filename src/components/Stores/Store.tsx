import React, { Component } from "react";
import { Helper } from "../../helpers/Helper";
import { Schema } from "./Schema";
import { Product } from "../../datas/Product";
import { User } from "../../datas/User";
import { Cart } from "../../datas/Cart";

/** Store props and states */
export type StoreItem = number | string | [] | object;
type StoreProps = {};
type StoreStates = { schema: Schema };
const Def: StoreItem = { carts: [] },
  Context = React.createContext<StoreItem>(Def),
  { Provider, Consumer } = Context;

class Store extends Component<StoreProps, StoreStates> {
  private key: string = "states";

  private actions: Array<Function | undefined> = [];
  private schema: Schema;
  public constructor(props: StoreProps) {
    super(props);
    this.schema = new Schema({ products: Product, users: User, carts: Cart });
  }

  public async componentDidMount() {}

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
          set: (
            key: string,
            val: StoreItem,
            action?: (items: StoreItem) => {}
          ): void => {
            this.actions.push(action);
            this.set(key, val);
          },
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
    const action = this.actions.shift();
    if (nextState && !Helper.compare(this.state, nextState)) {
      try {
        localStorage.setItem(this.key, JSON.stringify(nextState));
        if (action instanceof Function) {
          action(nextState);
        }
      } catch (e) {}
    }
    return false;
  }

  private set = (key: string, val: StoreItem): void => {
    this.setState((preState) => {
      const old = this.get(key, "");
      if (val && !Helper.compare(old, val)) {
        return { ...preState, ...{ [key]: val } };
      }
      return preState;
    });
  };
}

export { Store, Consumer as StoreConsumer, Context as StoreContext };
