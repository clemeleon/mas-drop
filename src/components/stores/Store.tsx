import React, { Component } from "react";
import { Schema } from "./Schema";
import { Product, ProductType } from "../../datas/Product";
import { User, UserType } from "../../datas/User";
import { Cart, CartType } from "../../datas/Cart";

/** Store props and states */
export type StoreItem = number | string | [] | object;

type StoreProps = {};

export type StoreStates = { user: User | undefined };

export type ClassType = User | Product | Cart;

export type DataType = { [key: string]: any };

const Def: StoreItem = { user: undefined },
  Context = React.createContext<StoreItem>(Def),
  { Provider, Consumer } = Context;

class Store extends Component<StoreProps, StoreStates> {
  private readonly schema: Schema;

  private loaded: boolean = false;

  public constructor(props: StoreProps) {
    super(props);
    this.schema = new Schema();
    this.state = {
      user: undefined,
    };
    this.createTables();
  }

  public componentDidMount() {}

  public render() {
    const { children } = this.props,
      { user } = this.state;

    return (
      <Provider
        value={{
          user,
          schema: this.schema,
        }}
      >
        {children}
      </Provider>
    );
  }

  private createTables(): boolean {
    if (!this.loaded) {
      this.schema.create<User, UserType>(User, (datas) => {
        const id = 6,
          temps: UserType[] = [];
        for (const data of datas) {
          data.parent = data.id !== id ? id : 0;
          temps.push(data);
        }
        return temps.slice(0, id);
      });
      this.schema.create<Product, ProductType>(Product);
      this.schema.create<Cart, CartType>(Cart, (datas) => {
        if (datas.length > 5) {
          return datas.slice(0, 5);
        }
        return datas;
      });
      this.loaded = true;
    }
    return this.loaded;
  }
}

export { Store, Consumer as StoreConsumer, Context as StoreContext };
