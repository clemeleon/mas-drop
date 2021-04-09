/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { Table } from "./Table";
import { IData } from "../../faces/IData";
import { ProductType } from "../../datas/Product";
import { User, UserType } from "../../datas/User";
import { Cart } from "../../datas/Cart";

export type DataType = ProductType | UserType | Cart;
export type DataList = (ProductType | UserType | Cart)[];
export type TableType<T extends IData> = {
  [key: string]: { new (datas: DataType | any): T };
};

export class Schema {
  private readonly tables: { [key: string]: Table<IData> } = {};

  private readonly base: string = "https://fakestoreapi.com";

  private options: {} = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  constructor(private readonly names: TableType<IData>, base: string = "") {
    if (base.length > 0 && base.startsWith("http")) {
      this.base = base;
    }
    /*for (const name in names) {
      if (names.hasOwnProperty(name)) {
        const type = names[name];
        Object.assign(this.tables, {
          [name]: new Table<IData>(name, type, this.fetch),
        });
      }
    }*/
  }

  public async allUsers<K extends keyof DataType>(
    fields: K[] = [],
    wheres: { [key: string]: any } = []
  ): Promise<User[]> {
    const table = this.create<User>("users");
    return await table.all();
  }

  private async fetch(path: string, option: {} = {}): Promise<DataList> {
    try {
      const opts = Object.assign(this.options, option),
        url = path.startsWith("http") ? path : `${this.base + path}`,
        res = await fetch(url, opts);
      return await res.json();
    } catch (e) {}
    return [];
  }

  private create<T extends IData>(name: string): Table<T> {
    if (!this.tables.hasOwnProperty(name)) {
      if (!this.names.hasOwnProperty(name)) {
        throw new Error();
      }
      const type = this.names[name];
      this.tables[name] = new Table<T>(name, type, this.fetch);
    }
    return this.tables[name];
  }
}
