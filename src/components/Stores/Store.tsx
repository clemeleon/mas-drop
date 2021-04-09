import React, { Component } from "react";
import { Schema } from "./Schema";
import { Product, ProductType } from "../../datas/Product";
import { User, UserType } from "../../datas/User";
import { Cart, CartType } from "../../datas/Cart";
import { IData } from "../../faces/IData";

/** Store props and states */
export type StoreItem = number | string | [] | object;
type StoreProps = {};
type StoreStates = { loaded: boolean };
export type DataType = { [key: string]: any };
const Def: StoreItem = { state: { loaded: false }, all: Function },
  Context = React.createContext<StoreItem>(Def),
  { Provider, Consumer } = Context;

class Store extends Component<StoreProps, StoreStates> {
  private schema: Schema;

  public constructor(props: StoreProps) {
    super(props);
    this.schema = new Schema();
    this.state = {
      loaded: false,
    };
  }

  public componentDidMount() {
    /*this.schema.create<User, UserType>(User, (datas) => {
      const id = 6,
        temps: UserType[] = [];
      console.log(datas);
      for (const data of datas) {
        if (data.id !== id) {
          data.parent = id;
        }
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
    });*/
    /*this.schema
      .prepare()
      .then((bol: boolean) => this.setState({ loaded: bol }));*/
  }

  private async prepare(): Promise<void> {
    if (this.state.loaded) {
      return;
    }
    this.schema.create<User, UserType>(User, (datas) => {
      const id = 6,
          temps: UserType[] = [];
      for (const data of datas) {
        if (data.id !== id) {
          data.parent = id;
        }
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
    await this.schema.prepare();
    this.setState({loaded: true});
  }

  public render() {
    const {children} = this.props;
    return (
        <Provider
            value={{
              states: this.state,
              all: async <T extends IData, K extends keyof DataType>(
                  table: string,
                  fields: K[] = [],
            wheres: { [key: string]: any } = {}
          ): Promise<T[]> => await this.all<T, K>(table, fields, wheres),
          get: async <T extends IData, K extends keyof DataType>(
            table: string,
            fields: K[] = [],
            wheres: { [key: string]: any } = {}
          ): Promise<T | undefined> =>
            await this.get<T, K>(table, fields, wheres),
          set: async <T extends IData>(
            table: string,
            data: T,
            changes: DataType = {}
          ): Promise<boolean> => await this.set<T>(table, data, changes),
        }}
      >
        {children}
      </Provider>
    );
  }

  private async set<T extends IData>(
    name: string,
    data: T,
    changes: DataType
  ): Promise<boolean> {
    await this.prepare();
    return await this.schema.set<T>(name, data, changes);
  }

  private async all<T extends IData, K extends keyof DataType>(
    table: string,
    fields: K[] = [],
    wheres: { [key: string]: any } = {}
  ): Promise<T[]> {
    await this.prepare();
    return this.schema.all<T, K>(table, fields, wheres);
  }

  private async get<T extends IData, K extends keyof DataType>(
    table: string,
    fields: K[] = [],
    wheres: { [key: string]: any } = {}
  ): Promise<T | undefined> {
    await this.prepare();
    return this.schema.get<T, K>(table, fields, wheres);
  }
}

export { Store, Consumer as StoreConsumer, Context as StoreContext };
