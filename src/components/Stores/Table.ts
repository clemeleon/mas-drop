/**
 * Package: Mas Drop.
 * 09 April 2021
 */
import { IData } from "../../faces/IData";
import { Helper } from "../../helpers/Helper";
import { DataList, DataType } from "./Schema";

export class Table<T extends IData> {
  private datas: DataList = [];

  constructor(
    public readonly key: string,
    private readonly type: { new (datas: DataType): T },
    private readonly action: (path: string, option?: {}) => Promise<DataList>
  ) {
    /*console.log(
      new type({
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      })
    );*/
  }

  public async all<K extends keyof DataType>(
    fields: K[] = [],
    wheres: { [key: string]: any } = []
  ): Promise<T[]> {
    if (!this.load() && !(await this.fetch())) {
      return [];
    }
    return this.populate(this.pick(wheres), fields);
  }

  public async get<K extends keyof DataType>(
    fields: K[] = [],
    wheres: { [key: string]: any } = []
  ): Promise<T | undefined> {
    if (!this.load() && !(await this.fetch())) {
      return undefined;
    }
    return this.populate(this.pick(wheres), fields).shift();
  }

  public async set(data: T): Promise<boolean> {
    if (!this.load() && !(await this.fetch())) {
      return false;
    }
    const raw: DataType = JSON.parse(JSON.stringify(data)),
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

  private load(): boolean {
    if (this.datas.length > 0) {
      return true;
    }
    try {
      const strs = localStorage.getItem(this.key),
        datas = strs && strs.length > 0 ? JSON.parse(strs) : [];
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

  private async fetch(): Promise<boolean> {
    try {
      return this.cache(await this.action(this.key));
    } catch (e) {}
    return false;
  }

  private pick<K extends keyof DataType>(keys: {
    [key: string]: any;
  }): DataList {
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

  private cache(datas: DataList): boolean {
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

  private populate<K extends keyof DataType>(
    datas: DataList,
    keys: K[] = []
  ): T[] {
    const classes: T[] = [];
    for (const data of datas) {
      let value = Object.assign({}, data);
      if (keys.length > 0) {
        for (const key of keys) {
          if (data.hasOwnProperty(key)) {
            continue;
          }
          let val;
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
