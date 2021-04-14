import { IData } from "../faces/IData";
import { Helper } from "../helpers/Helper";

export type ProductType = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export class Product implements IData {
  public readonly id: number;
  public readonly title: string;
  public readonly price: number;
  public readonly description: string;
  public readonly category: string;
  public readonly image: string;

  constructor({ id, title, price, description, category, image }: ProductType) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.category = category;
    this.image = image;
  }

  public name(): string {
    return Helper.truncate(this.title, 20);
  }

  public slug(): string {
    return Helper.slug(this.title);
  }
}
