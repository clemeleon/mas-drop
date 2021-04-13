import React, { Component } from "react";
import { Schema } from "./Schema";
import { Product, ProductType } from "../../datas/Product";
import { User, UserType } from "../../datas/User";
import { Cart, CartType } from "../../datas/Cart";
import { Helper } from "../../helpers/Helper";

/** Store props and states */

type StoreProps = {};

export type StoreStates = { id?: number; user?: User };

export type ClassType = User | Product | Cart;

export type DataType = { [key: string]: any };

export type StoreItem =
  | StoreStates
  | {
      db: () => Schema;
      set: (state: { [K in keyof StoreStates]: any }) => void;
    };

const schema = new Schema(),
  Def: StoreItem = {
    set: (state: { [K in keyof StoreStates]: any }): void => {},
    db: (): Schema => schema,
  },
  Context = React.createContext<StoreItem>(Def),
  { Provider, Consumer } = Context;

class Store extends Component<StoreProps, StoreStates> {
  private loaded: boolean = false;

  private excludes: string[] = ["user"];

  private str: string = "key";

  public constructor(props: StoreProps) {
    super(props);
    this.createTables();
  }

  /*shouldComponentUpdate(
    nextProps: Readonly<StoreProps>,
    nextState: Readonly<StoreStates>,
    nextContext: any
  ): boolean {
    try {
      const { id } = nextState,
        key = this.state.id;
      if (id !== key) {
        if (id > 0) {
          sessionStorage.setItem(this.str, id.toString());
        } else {
          sessionStorage.removeItem(this.str);
        }
        return true;
      } else {
        return nextState && !Helper.compare(this.state, nextState);
      }
    } catch (e) {}
    return false;
  }*/

  shouldComponentUpdate(
    nextProps: Readonly<StoreProps>,
    nextState: Readonly<StoreStates>,
    nextContext: any
  ): boolean {
    try {
      if (Helper.state(this.state, nextState)) {
        const { id } = nextState,
          key = this.state.id;
        if (id && id !== key) {
          if (id > 0) {
            sessionStorage.setItem(this.str, id.toString());
          } else {
            sessionStorage.removeItem(this.str);
          }
          this.update(id).then();
          return false;
        }
        return true;
      }
    } catch (e) {}
    return false;
  }

  public async componentDidMount() {
    let id = 0;
    try {
      const key = sessionStorage.getItem(this.str);
      if (typeof key === "string") {
        id = parseInt(key);
      }
    } catch (e) {}
    await this.update(id);
  }

  private async update(id: number): Promise<boolean> {
    const user = await schema.user({ id }, true);
    this.setState({ user, id });
    return true;
  }

  private get = (): StoreStates => this.state;

  /*private set = (state: StoreStates): boolean => {
    let bol = false,
      old: { [key: string]: any } = { ...this.state };
    for (const [key, val] of Object.entries(state)) {
      if (!this.state.hasOwnProperty(key)) {
        throw new Error(`${key} does not exist in state`);
      }
      if (old[key] !== val) {
        bol = true;
      }
    }
    if (bol) {
      this.setState(state);
      return true;
    }
    return false;
  };*/

  private set = (state: { [K in keyof StoreStates]: any }): void => {
    let bol = false,
      old: { [key: string]: any } = { ...this.state };
    for (const [key, val] of Object.entries(state)) {
      if (!this.state.hasOwnProperty(key)) {
        throw new Error(`${key} does not exist in state`);
      }
      if (this.excludes.includes(key)) {
        throw new Error(`Can not set this ${key} from outside`);
      }
      if (old[key] !== val) {
        bol = true;
      }
    }
    if (bol) {
      this.setState(state);
    }
  };

  public render() {
    const { children } = this.props;

    return (
      <Provider
        value={{ ...this.state, ...{ set: this.set, db: () => schema } }}
      >
        {children}
      </Provider>
    );
  }

  private createTables(): boolean {
    if (!this.loaded) {
      schema.create<User, UserType>(User, (datas) => {
        const id = 1,
          temps: UserType[] = [];
        for (const data of datas) {
          data.parent = data.id !== id ? id : 0;
          temps.push(data);
        }
        return temps.slice(0, 6);
      });
      schema.create<Product, ProductType>(Product);
      schema.create<Cart, CartType>(Cart, (datas) => {
        if (datas.length > 5) {
          datas = datas.slice(0, 5);
        }
        let i,
          len = datas.length;
        for (i = 0; i < len; i++) {
          datas[i].userId = i + 2;
        }
        return datas;
      });
      this.loaded = true;
    }
    return this.loaded;
  }
}

export { Store, Consumer as StoreConsumer, Context as StoreContext };
