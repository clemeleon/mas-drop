export class Product {
  public readonly id: number;
  public readonly title: string;
  public readonly price: number;
  public readonly description: string;
  public readonly category: string;
  public readonly image: string;

  constructor({
    id,
    title,
    price,
    description,
    category,
    image,
  }: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.category = category;
    this.image = image;
  }
}
