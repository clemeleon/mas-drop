import { IData } from "../faces/IData";

export type CartProduct = Array<{
  productId: number;
  quantity: number;
  approved: boolean;
}>;
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
  public products: CartProduct;
  //public productList: Product[] = [];

  constructor({ id, userId, date, products }: CartType) {
    this.id = id;
    this.userId = userId;
    this.date = date;
    this.products = products;
  }

  public plusz(id: number): void {
    const len = this.products.length;
    for (let i = 0; i < len; i++) {
      const product = this.products[i];
      if (product.productId === id) {
        this.products[i].quantity = this.products[i].quantity + 1;
      }
    }
  }

  public plus(id: number): void {
    const pro = this.products.find((p) => p.productId === id),
      index = pro ? this.products.indexOf(pro) : -1;
    if (index === -1 || !pro) {
      return;
    }
    this.products[index].quantity = pro.quantity + 1;
  }

  public minus(id: number): void {
    const pro = this.products.find((p) => p.productId === id),
      index = pro ? this.products.indexOf(pro) : -1;
    if (index === -1 || !pro) {
      return;
    }
    const quantity = pro.quantity - 1;
    if (quantity > 0) {
      this.products[index].quantity = quantity;
      return;
    }
    this.products = this.products.filter((pro) => pro.productId !== id);
  }

  public add(id: number): void {
    if (!this.products.find((pro) => pro.productId === id)) {
      this.products.push({ productId: id, quantity: 1, approved: false });
    }
  }

  public remove(id: number): void {
    const product = this.products.find((pro) => pro.productId === id);
    if (product) {
      this.products = this.products.filter((pro) => pro.productId !== id);
    }
  }
}
