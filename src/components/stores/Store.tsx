/**
 * Package: mas-drop.
 * 10 April 2021
 */
/*import { Render } from "../../helpers/types";
import React, {FC, useReducer} from "react";
import {User} from "../../datas/User";
type StoreStates = {id: number, user: User | undefined}
type Actions = {type: string, payload: {[K keyof StoreStates]: any}}
const Reducer = (state: any, action: Actions) => {
  switch (action.type) {
    case 'update':
  }
}, Store: FC<{ children: Render[] }> = ({ children }): Render =>
const [state, dispatch] = useReducer(Reducer, {});
  return <div>hoom</div>;
};
export { Store };*/
import { User, UserType } from "../../datas/User";
import { Product, ProductType } from "../../datas/Product";
import { Cart, CartProduct, CartType } from "../../datas/Cart";
import { Schema } from "./Schema";
import React, { Component, createContext } from "react";
import { Helper } from "../../helpers/Helper";

type StoreProps = {};

type StoreStates = {
  id: number;
  user: User | undefined;
  users: User[];
  products: Product[];
  loading: boolean;
};

type ClassType = User | Product | Cart;

type DataType = { [key: string]: any };

export type StoreItem = [
  StoreStates,
  ({
    state,
    cart,
  }: {
    state?: { [K in keyof StoreStates]: any };
    cart?: Cart;
  }) => void
  //(state: { [K in keyof StoreStates]: any }) => void
];

const schema = new Schema(),
  Def: StoreItem = [
    { id: 0, user: undefined, users: [], products: [], loading: true },
    ({ state, cart }): void => {},
    //(state: { [K in keyof StoreStates]: any }): void => {},
  ],
  Context = createContext<StoreItem>(Def),
  { Provider, Consumer } = Context;

class Store extends Component<StoreProps, StoreStates> {
  private str: string = "key";

  private excludes: string[] = ["user", "products", "users"];

  private loaded: boolean = false;

  private skip: boolean = false;

  private engine: Storage = sessionStorage;

  public constructor(props: StoreProps) {
    super(props);
    this.state = {
      id: 0,
      user: undefined,
      products: [],
      users: [],
      loading: true,
    };
    this.tables();
  }

  private tables() {
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

  private async update(id: number): Promise<boolean> {
    let loading = false,
      { users, products } = this.state,
      user = id > 0 ? await schema.user({ id }, true, true) : undefined;
    products = products.length > 0 ? products : await schema.products();
    users =
      users.length > 0
        ? users
        : (await schema.users(true)).sort((a, b) =>
            a.parent > b.parent ? 1 : -1
          );
    this.setState({ user, id, loading, products, users });
    return false;
  }

  public componentDidMount() {
    let id = 0;
    try {
      const key = this.engine.getItem(this.str);
      if (typeof key === "string") {
        id = parseInt(key);
      }
    } catch (e) {}
    this.skip = true;
    this.update(id).then((bol) => {
      this.skip = bol;
    });
  }

  shouldComponentUpdate(
    nextProps: Readonly<StoreProps>,
    nextState: Readonly<StoreStates>,
    nextContext: any
  ): boolean {
    try {
      if (Helper.state(this.state, nextState)) {
        const { id } = this.state,
          key = nextState.id;
        if (id !== key) {
          if (key > 0) {
            this.engine.setItem(this.str, key.toString());
          } else {
            this.engine.removeItem(this.str);
          }
          if (!this.skip) {
            this.skip = true;
            this.update(key).then((bol) => {
              this.skip = bol;
            });
            return false;
          }
        }
        return true;
      }
    } catch (e) {}
    return false;
  }

  private dispatchs = (state: { [K in keyof StoreStates]: any }): void => {
    const keys = Object.keys(state) as [keyof StoreStates];
    for (const key of keys) {
      if (!this.state.hasOwnProperty(key)) {
        throw new Error(`${key} does not exist in state`);
      } else if (this.excludes.includes(key)) {
        throw new Error(`Can not set this ${key} from outside`);
      }
    }
    this.setState({ ...this.state, ...state });
  };

  /*private async checkCart(temp?: Cart): Promise<User | undefined> {
    if (temp instanceof Cart) {
      const { user } = this.state;
      const cart = user?.cart;
      if (cart instanceof Cart) {
        const list = [],
          carts = cart.proCarts,
          ones = carts.map((c) => c.productId),
          twos = temps.map((t) => t.productId),
          ids = Array.from(new Set(ones.concat(twos)));
        for (const id of ids) {
          const one = temps.find((cart) => cart.productId === id),
            two = temps.find((temp) => temp.productId === id);
          if ((one && two) || (!one && two)) {
            list.push(two);
          } else if (one && !two) {
            list.push(one);
          }
        }
        user.cart = await schema.set<Cart>("carts", cart, { proCarts: list });
        return user;
      }
    }
    return undefined;
  }*/

  private async checkCart(temp?: Cart): Promise<User | undefined> {
    const { user } = this.state;
    if (temp instanceof Cart && user instanceof User) {
      const old = user.cart;
      if (old instanceof Cart && old.id === temp.id) {
        const carts = [],
          pros = old.proCarts,
          temps = temp.proCarts,
          ones = pros.map((c) => c.productId),
          twos = temps.map((t) => t.productId),
          ids = Array.from(new Set(ones.concat(twos)));
        for (const id of ids) {
          const one = pros.find((cart) => cart.productId === id),
            two = temps.find((temp) => temp.productId === id);
          if ((one && two) || (!one && two)) {
            carts.push(two);
          } else if (one && !two) {
            carts.push(one);
          }
        }
        user.cart = await schema.set<Cart>("carts", temp, {
          date: temp.date,
          proCart: carts,
        });
        return user;
      }
    }
    return undefined;
  }

  private dispatch = ({
    state,
    cart,
  }: {
    state?: { [K in keyof StoreStates]: any };
    cart?: Cart;
  }): void => {
    const states: { [K in keyof StoreStates]?: any } = {};
    if (state) {
      const keys = Object.keys(state) as [keyof StoreStates];
      for (const key of keys) {
        if (!this.state.hasOwnProperty(key)) {
          throw new Error(`${key} does not exist in state`);
        } else if (this.excludes.includes(key)) {
          throw new Error(`Can not set this ${key} from outside`);
        }
        states[key] = state[key];
      }
    }
    this.checkCart(cart).then((user: User | undefined) => {
      if (user) {
        states.user = user;
      }
      if (states && Object.keys(states).length > 0) {
        this.setState({ ...this.state, ...states });
      }
    });
  };

  public render() {
    const { children } = this.props;
    return <Provider value={[this.state, this.dispatch]}>{children}</Provider>;
  }
}

export { Store, Context, Consumer };
export type { ClassType, StoreStates, StoreProps, DataType };
