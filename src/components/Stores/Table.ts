/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { IData } from "../../faces/IData";
import { Helper } from "../../helpers/Helper";
import { DataType } from "./Store";

export class Table<T extends IData, C extends DataType> {
  private datas: C[] = [];

  constructor(
    public readonly key: string,
    private readonly type: { new (datas: C): T },
    private readonly format: (datas: C[]) => C[],
    private readonly fetch: (path: string, option?: {}) => Promise<C[]>
  ) {}

  public async all<K extends keyof C>(
    fields: K[] = [],
    wheres: { [key: string]: any } = {}
  ): Promise<T[]> {
    if (!(await this.load())) {
      console.log("1x");
      return [];
    }
    return this.populate(this.pick(wheres), fields);
  }

  public async get<K extends keyof C>(
    fields: K[] = [],
    wheres: { [key: string]: any } = []
  ): Promise<T | undefined> {
    if (!(await this.load())) {
      return undefined;
    }
    return this.populate(this.pick(wheres), fields).shift();
  }

  public async set(data: T): Promise<boolean> {
    if (!(await this.load())) {
      return false;
    }
    const raw: C = JSON.parse(JSON.stringify(data)),
      old = this.datas.find((one) => {
        return one.id === raw.id;
      });
    if (!old) {
      return false;
    }
    if (Helper.compare(raw, old)) {
      return true;
    }
    const index = this.datas.indexOf(old);
    this.datas[index] = raw;
    return this.save();
  }

  private async load(): Promise<boolean> {
    if (this.datas.length > 0) {
      return true;
    }
    try {
      let strs = localStorage.getItem(this.key),
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
        localStorage.setItem(this.key, JSON.stringify(this.datas));
        return true;
      }
    } catch (e) {}
    return false;
  }

  private pick<K extends keyof C>(keys: { [key: string]: any }): C[] {
    const datas = [...this.datas];
    return datas.filter((data) => {
      for (const [key, value] of Object.entries(keys)) {
        if (data.hasOwnProperty(key) && keys.hasOwnProperty(key)) {
          try {
            return value === data[key as K];
          } catch (e) {
            return false;
          }
        }
      }
      return true;
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
    } catch (e) {}
    return false;
  }

  private populate<K extends keyof C>(datas: C[], keys: K[] = []): T[] {
    const classes: T[] = [],
      temps = Object.keys(datas[0]);
    for (const data of datas) {
      let value = Object.assign({}, data);
      if (keys.length > 0) {
        for (const temp of temps) {
          let key = temp as K,
            val;
          if (keys.includes(key)) {
            continue;
          }
          if (typeof data[key] === "object") {
            val = {};
          } else if (Array.isArray(data[key])) {
            val = [];
          } else if (typeof data[key] === "string") {
            val = "";
          } else if (typeof data[key] === "number") {
            val = 0;
          } else if (typeof data[key] === "boolean") {
            val = false;
          }
          Object.assign(value, { [key]: val });
        }
      }
      classes.push(new this.type(value));
    }
    return classes;
  }
}
