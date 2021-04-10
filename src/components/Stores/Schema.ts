/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { Table } from "./Table";
import { IData } from "../../faces/IData";
import { ClassType, DataType } from "./Store";

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

  public async all<T extends ClassType>(
    name: string,
    fields: string[] = [],
    wheres: { [key: string]: any } = {}
  ): Promise<T[]> {
    const table = await this.table<T, DataType>(name);
    return await table.all(fields, wheres);
  }

  public async get<T extends ClassType>(
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
