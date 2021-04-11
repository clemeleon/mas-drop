/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { IData } from "../../faces/IData";
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
    ids: Array<number> = []
  ): Promise<T[]> {
    if (!(await this.load())) {
      return [];
    }
    return this.populate(this.pickAll(ids), fields);
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

  /*public async setx<K extends keyof C>(data: T, keys: K[]): Promise<boolean> {
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
  }*/

  public async set<K extends keyof C>(data: T, changes: DataType): Promise<T> {
    if (!(await this.load())) {
      return data;
    }
    const raw: C = JSON.parse(JSON.stringify(data)),
      old = this.datas.find((one) => {
        return one.id === raw.id;
      }),
      keys = Object.keys(changes);
    if (!old) {
      return data;
    }
    if (keys.length <= 0) {
      throw new Error("modified keys are needed!");
    }
    const index = this.datas.indexOf(old);
    let bol = false;
    for (const key of keys) {
      if (changes.hasOwnProperty(key) && old.hasOwnProperty(key)) {
        if (
          typeof changes[key] === typeof old[key] &&
          changes[key] !== old[key]
        ) {
          if (key === "id") {
            throw new Error("Can not change id!");
          }
          raw[key as K] = this.update(raw[key as K], changes[key]);
          this.datas[index][key as K] = raw[key as K];
          if (!bol) {
            bol = true;
          }
        }
      }
    }
    if (bol) {
      this.save();
    }
    return this.populate([raw])[0];
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

  private pickAll(keys: number[]): C[] {
    const datas = [...this.datas];
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
          const key = temp as K;
          if (keys.includes(key) || ["id"].includes(temp)) {
            continue;
          }
          Object.assign(value, { [key]: this.value(data[key]) });
        }
      }
      classes.push(new this.type(value));
    }
    return classes;
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
}
