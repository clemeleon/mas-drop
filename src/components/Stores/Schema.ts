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

  public create<T extends IData, C extends DataType>(type: {
    new (datas: C): T;
  }): void {
    const name = `${type.name.toLocaleLowerCase()}s`;
    if (!this.tables.hasOwnProperty(name)) {
      this.tables[name] = new Table<T, C>(name, type, this.fetch);
    }
  }

  public async all<T extends IData, K extends keyof DataType>(
    name: string,
    fields: K[] = [],
    wheres: { [key: string]: any } = {}
  ): Promise<T[]> {
    if (name.length <= 0 && !this.tables.hasOwnProperty(name)) {
      return [];
    }
    return await this.tables[name].all<K>(fields, wheres);
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
}
