/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { IData } from "../../faces/IData";
import { DataType } from "./Store";
import { Helper } from "../../helpers/Helper";

export class Table<T extends IData, C extends DataType> {
  private datas: C[] = [];

  private engine: Storage = localStorage;

  constructor(
    public readonly key: string,
    private readonly type: { new (datas: C): T },
    private readonly format: (datas: C[]) => C[],
    private readonly fetch: (path: string, option?: {}) => Promise<C[]>
  ) {}

  public async all<K extends keyof C>(
    fields: K[],
    wheres: { [K in keyof C]: any },
    ids: Array<number> = [],
    limit: [number, number] = [0, 0]
  ): Promise<T[]> {
    if (!(await this.load())) {
      return [];
    }
    const temps = this.pick(wheres),
      datas = this.populate(this.pickAll(ids, temps), fields),
      [start, end] = limit;
    return datas.length > end && end > 0 ? datas.splice(start, end) : datas;
  }

  public async get<K extends keyof C>(
    fields: K[],
    wheres: { [K in keyof C]: any }
  ): Promise<T | undefined> {
    if (!(await this.load())) {
      return undefined;
    }
    const temps = this.pick(wheres);
    return temps.length > 0 ? this.populate(temps, fields).shift() : undefined;
  }

  public async set(data: T): Promise<boolean> {
    if (!(await this.load())) {
      return false;
    }
    const raw: C = Helper.clone(data),
      old = this.datas.find((one) => {
        return one.id === raw.id;
      }),
      index = old ? this.datas.indexOf(old) : -1;
    if (!old) {
      return false;
    }
    if (!Helper.compare(raw, old) && index > -1) {
      this.datas[index] = raw;
      return this.save();
    }
    return false;
  }

  private update(data: any, update: any): any {
    if (typeof data === "object" && typeof update === "object") {
      for (const [key, val] of Object.entries(update)) {
        if (data.hasOwnProperty(key)) {
          data[key] = this.update(data[key], val);
        }
      }
      return data;
    } else if (typeof data === typeof update) {
      return update;
    }
    return data;
  }

  private async load(): Promise<boolean> {
    if (this.datas.length > 0) {
      return true;
    }
    try {
      let strs = this.engine.getItem(this.key),
        datas = strs && strs.length > 0 ? JSON.parse(strs) : [];
      if (datas.length <= 0) {
        datas = this.format(await this.fetch(this.key));
      }
      return this.cache(datas);
    } catch (e) {}
    return false;
  }

  private save(): boolean {
    try {
      if (this.datas.length > 0) {
        this.engine.setItem(this.key, JSON.stringify(this.datas));
        return true;
      }
    } catch (e) {}
    return false;
  }

  private pick(keys: { [K in keyof C]: any }): C[] {
    const datas = [...this.datas];
    return datas.filter((data) => {
      for (const [key, value] of Object.entries(keys)) {
        if (data.hasOwnProperty(key) && keys.hasOwnProperty(key)) {
          try {
            return value === data[key];
          } catch (e) {
            return false;
          }
        }
      }
      return true;
    });
  }

  private pickAll(keys: number[], datas: C[]): C[] {
    return datas.filter((data) => {
      return keys.length === 0 || keys.includes(data.id);
    });
  }

  private cache(datas: C[]): boolean {
    if (datas.length <= 0) {
      return false;
    }
    try {
      this.datas = datas;
      if (!this.save()) {
        this.datas = [];
      }
      return true;
    } catch (e) {
      console.log(e.message);
    }
    return false;
  }

  private value(value: any): any {
    if (typeof value === "object") {
      const obj: { [key: string]: any } = {};
      for (const [key, val] of Object.entries(value)) {
        obj[key] = this.value(val);
      }
      return obj;
    } else if (Array.isArray(value)) {
      return [];
    } else if (typeof value === "string") {
      return "";
    } else if (typeof value === "number") {
      return 0;
    } else if (typeof value === "boolean") {
      return false;
    }
    return undefined;
  }

  private populate<K extends keyof C>(datas: C[], keys: K[] = []): T[] {
    const classes: T[] = [],
      temps = Object.keys(datas[0]);
    try {
      for (const data of datas) {
        let value = Object.assign({}, data);
        if (keys.length > 0) {
          for (const temp of temps) {
            const key = temp as K;
            if (keys.includes(key) || ["id"].includes(temp)) {
              continue;
            }
            if (data.hasOwnProperty(key)) {
              Object.assign(value, { [key]: this.value(data[key]) });
            }
          }
        }
        if (value) {
          classes.push(new this.type(Helper.clone(value)));
        }
      }
    } catch (e) {
      console.log(e.message);
    }
    return classes;
  }
}
