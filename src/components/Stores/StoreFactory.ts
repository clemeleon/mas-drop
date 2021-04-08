/**
 * Package: Mas Drop.
 * 08 April 2021
 */
import { Product } from "../../datas/Product";

export class StoreFactory {
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
  }

  public async products(): Promise<Array<Product>> {
    return await this.fetch("/products");
  }

  private async fetch(path: string, option: {} = {}): Promise<any> {
    try {
      const opts = Object.assign(this.options, option),
        url = path.startsWith("http") ? path : `${this.base + path}`,
        res = await fetch(url, opts);
      return await res.json();
    } catch (e) {}
    return null;
  }
}
