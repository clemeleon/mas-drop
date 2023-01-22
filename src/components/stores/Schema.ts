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

  public message: string = "";

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

  public isError(): boolean {
    return this.message.length > 0;
  }

  public error(): string {
    const error = this.message;
    this.message = "";
    return error;
  }

  public create<T extends IData, C extends DataType>(
    type: {
      new (datas: C): T;
    },
    format?: (datas: C[]) => C[]
  ): boolean {
    try {
      format = format ? format : (datas: C[]): C[] => datas;
      const name = `${type.name.toLocaleLowerCase()}s`;
      if (!this.tables.hasOwnProperty(name)) {
        this.tables[name] = new Table<T, C>(name, type, format, this.fetch);
        return true;
      }
    } catch (e) {
      // @ts-ignore
      this.message = `${e.message} on db.create`;
    }
    return false;
  }

  private async all<T extends ClassType>(
    name: string,
    fields: string[] = [],
    wheres: { [K in keyof DataType]: any },
    ids: number[] = [],
    limit: [number, number]
  ): Promise<T[]> {
    const table = await this.table<T, DataType>(name);
    if (!table) {
      return [];
    }
    try {
      return await table.all(fields, wheres, ids, limit);
    } catch (e) {
      // @ts-ignore
      this.message = `${e.message} on db.all()`;
    }
    return [];
  }

  private async get<T extends ClassType>(
    name: string,
    fields: string[] = [],
    wheres: { [K in keyof DataType]: any }
  ): Promise<T | undefined> {
    const table = await this.table<T, DataType>(name);
    if (!table) {
      return undefined;
    }
    try {
      if (Object.keys(wheres).length <= 0) {
        this.message =
          "Wheres parameters can not be empty, the condition is needed, example: {id: 1}!";
      }
      return await table.get(fields, wheres);
    } catch (e) {
      // @ts-ignore
      this.message = `${e.message} on db.get()`;
    }
    return undefined;
  }

  public async user(
    wheres: { [K in keyof DataType]: any },
    fields: string[] = []
  ): Promise<User | undefined> {
    return await this.get<User>("users", fields, wheres);
  }

  public async users(
    ids: Array<number> = [],
    fields: string[] = [],
    wheres: { [K in keyof DataType]: any } = {},
    limit: [number, number] = [0, 0]
  ): Promise<User[]> {
    return await this.all<User>("users", fields, wheres, ids, limit);
  }

  public async cart(
    wheres: { [key: string]: any },
    fields: string[] = []
  ): Promise<Cart | undefined> {
    return await this.get<Cart>("carts", fields, wheres);
  }

  public async carts(
    ids: Array<number> = [],
    fields: string[] = [],
    wheres: { [K in keyof DataType]: any } = {},
    limit: [number, number] = [0, 0]
  ): Promise<Cart[]> {
    return await this.all<Cart>("carts", fields, wheres, ids, limit);
  }

  public async product(
    wheres: { [key: string]: any },
    fields: string[] = []
  ): Promise<Product | undefined> {
    return await this.get<Product>("products", fields, wheres);
  }

  public async products(
    ids: Array<number> = [],
    fields: string[] = [],
    wheres: { [K in keyof DataType]: any } = {},
    limit: [number, number] = [0, 0]
  ): Promise<Product[]> {
    return await this.all<Product>("products", fields, wheres, ids, limit);
  }

  public async set<T extends ClassType>(
    name: string,
    data: T
  ): Promise<boolean> {
    const table = await this.table<T, DataType>(name);
    if (!table) {
      return false;
    }
    try {
      return await table.set(data);
    } catch (e) {
      // @ts-ignore
      this.message = `${e.message} on db.set()`;
    }
    return false;
  }

  private async table<T extends IData, C extends DataType>(
    name: string
  ): Promise<Table<T, C> | undefined> {
    try {
      if (name.length <= 0) {
        this.message = "Table name cannot be null or empty!";
      } else if (!this.tables.hasOwnProperty(name)) {
        this.message = `No table found with the ${name}, make sure table are created first!`;
      }
      await this.prepare();
      return this.tables[name];
    } catch (e) {
      // @ts-ignore
      this.message = `${e.message} on db.table()`;
    }
    return undefined;
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
      // @ts-ignore
      this.message = `${e.message} on db.fetch`;
    }
    return [];
  };

  private async prepare(): Promise<boolean> {
    if (this.loaded) {
      return true;
    }
    const tables = Object.values(this.tables);
    for (const table of tables) {
      await table.all([], {});
    }
    return true;
  }
}
