/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { Table } from "./Table";
import { IData } from "../../faces/IData";
import { DataType } from "./Store";

export class Schema {
  private readonly tables: { [key: string]: Table<any, any> } = {};

  private readonly base: string = "https://fakestoreapi.com";

  private options: {} = {
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
    /*for (const name in names) {
      if (names.hasOwnProperty(name)) {
        const type = names[name];
        Object.assign(this.tables, {
          [name]: new Table<IData>(name, type, this.fetch),
        });
      }
    }*/
  }

  public create<T extends IData, C extends DataType>(
    name: string,
    type: { new (datas: C): T }
  ): void {
    if (!this.tables.hasOwnProperty(name)) {
      this.tables[name] = new Table<T, C>(name, type, this.fetch);
    }
  }

  private async fetch<C>(path: string, option: {} = {}): Promise<C[]> {
    try {
      const opts = Object.assign(this.options, option),
        url = path.startsWith("http") ? path : `${this.base + path}`,
        res = await fetch(url, opts);
      return await res.json();
    } catch (e) {}
    return [];
  }
}
