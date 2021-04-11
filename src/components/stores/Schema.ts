/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { Table } from "./Table";
import { ClassType, DataType } from "./Store";
import { IData } from "../../faces/IData";
import { Product } from "../../datas/Product";
import { Cart } from "../../datas/Cart";
import { User } from "../../datas/User";

export class Schema {
  private readonly tables: { [key: string]: Table<any, any> } = {};

  private readonly base: string = "https://fakestoreapi.com";

  private loaded: boolean = false;

  private readonly options: {} = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  constructor(base: string = "") {
    if (base.length > 0 && base.startsWith("http")) {
      this.base = base;
    }
  }

  public create<T extends IData, C extends DataType>(
    type: {
      new (datas: C): T;
    },
    format?: (datas: C[]) => C[]
  ): boolean {
    format = format ? format : (datas: C[]): C[] => datas;
    const name = `${type.name.toLocaleLowerCase()}s`;
    if (!this.tables.hasOwnProperty(name)) {
      this.tables[name] = new Table<T, C>(name, type, format, this.fetch);
      return true;
    }
    return false;
  }

  private async all<T extends ClassType>(
    name: string,
    fields: string[] = [],
    ids: number[] = []
  ): Promise<T[]> {
    const table = await this.table<T, DataType>(name);
    return await table.all(fields, ids);
  }

  private async get<T extends ClassType>(
    name: string,
    fields: string[] = [],
    wheres: { [key: string]: any } = {}
  ): Promise<T | undefined> {
    const table = await this.table<T, DataType>(name);
    if (Object.keys(wheres).length <= 0) {
      throw new Error(
        "Wheres parameters can not be empty, the condition is needed, example: {id: 1}!"
      );
    }
    return await table.get(fields, wheres);
  }

  public async user(
    wheres: { [key: string]: any },
    cart: boolean = false,
    product: boolean = false,
    fields: string[] = []
  ): Promise<User | undefined> {
    let user = await this.get<User>("users", fields, wheres);
    if (user instanceof User && cart) {
      user.cart = await this.cart({ userId: user.id }, product, []);
    }
    return user;
  }

  public async users(
    cart: boolean = false,
    product: boolean = false,
    ids: Array<number> = [],
    fields: string[] = [],
  ): Promise<User[]> {
    let users = await this.all<User>("users", fields, ids);
    if (users.length > 0 && cart) {
      for (const user of users) {
        user.cart = await this.cart({userId: user.id}, product);
      }
    }
    return users;
  }

  public async cart(
    wheres: { [key: string]: any },
    product: boolean = false,
    fields: string[] = []
  ): Promise<Cart | undefined> {
    const cart = await this.get<Cart>("cart", fields, wheres);
    if (cart instanceof Cart && product) {
      const keys = cart.proCarts.map((pro) => pro.productId);
      cart.products = await this.products(keys, []);
    }
    return cart;
  }

  public async carts(
    product: boolean = false,
    ids: Array<number> = [],
    fields: string[] = []
  ): Promise<Cart[]> {
    const carts = await this.all<Cart>("carts", fields, ids);
    if (carts.length > 0 && product) {
      for (const cart of carts) {
        const keys = cart.proCarts.map((pro) => pro.productId);
        cart.products = await this.products(keys, []);
      }
    }
    return carts;
  }

  public async product(
    wheres: { [key: string]: any },
    fields: string[] = []
  ): Promise<Product | undefined> {
    return await this.get<Product>("products", fields, wheres);
  }

  public async products(
    ids: Array<number> = [],
    fields: string[] = []
  ): Promise<Product[]> {
    return await this.all<Product>("products", fields, ids);
  }

  public async set<T extends ClassType>(
    name: string,
    data: T,
    changes: DataType
  ): Promise<T> {
    const table = await this.table<T, DataType>(name);
    if (Object.keys(changes).length <= 0) {
      throw new Error(
        "Changes parameter can not be empty, all the update key/value, example: {id: 1}!"
      );
    }
    return await table.set(data, changes);
  }

  private async table<T extends IData, C extends DataType>(
    name: string
  ): Promise<Table<T, C>> {
    if (name.length <= 0) {
      throw new Error(`Table cannot be null or empty!`);
    } else if (!this.tables.hasOwnProperty(name)) {
      throw new Error(
        `No table found with the ${name}, make sure table are created first!`
      );
    }
    await this.prepare();
    return this.tables[name];
  }

  private fetch = async <C>(path: string, option: {} = {}): Promise<C[]> => {
    try {
      const opts = Object.assign(this.options, option),
        url = path.startsWith("http")
          ? path
          : `${
              path.startsWith("/") ? this.base + path : this.base + "/" + path
            }`,
        res = await fetch(url, opts);
      return (await res.json()) as C[];
    } catch (e) {
      console.log(e.message);
    }
    return [];
  };

  private async prepare(): Promise<boolean> {
    if (this.loaded) {
      return true;
    }
    const tables = Object.values(this.tables);
    for (const table of tables) {
      await table.all();
    }
    return true;
  }
}
