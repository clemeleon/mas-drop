import { IData } from "../faces/IData";

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
  public readonly products: CartProduct;

  constructor({ id, userId, date, products }: CartType) {
    this.id = id;
    this.userId = userId;
    this.date = date;
    this.products = products;
  }

  public plus(id: number): void {
    const len = this.products.length;
    for (let i = 0; i < len; i++) {
      const product = this.products[i];
      if (product.productId === id) {
        this.products[i].quantity = this.products[i].quantity + 1;
      }
    }
  }

  public minus(id: number): boolean {
    const len = this.products.length;
    for (let i = 0; i < len; i++) {
      const product = this.products[i];
      if (product.productId === id) {
        this.products[i].quantity = this.products[i].quantity - 1;
        if (this.products[i].quantity === 0) {
          this.products.slice(i, 1);
          return false;
        }
      }
    }
    return true;
  }
}
