import { IData } from "../faces/IData";
import { Product } from "./Product";

export type CartProduct = Array<{ productId: number; quantity: number }>;
export type CartType = {
  id: number;
  userId: number;
  date: string;
  products: CartProduct;
};
export class Cart implements IData {
  public readonly id: number;
  public readonly userId: number;
  public readonly date: string;
  public proCarts: CartProduct;
  public products: Product[] = [];

  constructor({ id, userId, date, products }: CartType) {
    this.id = id;
    this.userId = userId;
    this.date = date;
    this.proCarts = products;
  }

  public plus(id: number): void {
    const len = this.proCarts.length;
    for (let i = 0; i < len; i++) {
      const product = this.proCarts[i];
      if (product.productId === id) {
        this.proCarts[i].quantity = this.proCarts[i].quantity + 1;
      }
    }
  }

  public minus(id: number): boolean {
    const len = this.proCarts.length;
    for (let i = 0; i < len; i++) {
      const product = this.proCarts[i];
      if (product.productId === id) {
        this.proCarts[i].quantity = this.proCarts[i].quantity - 1;
        if (this.proCarts[i].quantity === 0) {
          this.proCarts.slice(i, 1);
          this.products = this.products.filter((pro) => pro.id !== id);
          return false;
        }
      }
    }
    return true;
  }

  public add(product: Product): void {
    if (!this.products.find((pro) => pro.id !== product.id)) {
      this.products.push(product);
      this.proCarts.push({ productId: product.id, quantity: 1 });
    }
  }

  public remove(id: number): void {
    const product = this.products.find((pro) => pro.id !== id);
    if (product instanceof Product) {
      this.products = this.products.filter((pro) => pro.id !== product.id);
      const len = this.proCarts.length;
      for (let i = 0; i < len; i++) {
        const pro = this.proCarts[i];
        if (pro.productId === id) {
          this.proCarts.slice(i, 1);
        }
      }
    }
  }
}
