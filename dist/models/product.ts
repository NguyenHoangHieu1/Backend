import db from "../database/database";
import ProductInterface from "../interfaces/Product";
export default class Product {
  constructor(
    private title: string,
    private price: number,
    private description: string,
    private imageUrl: string,
    private userId: number,
    private product_id?: string
  ) {}

  public get getProductId(): string | undefined {
    return this.product_id;
  }

  public get getTitle(): string {
    return this.title;
  }
  public get getPrice(): number {
    return this.price;
  }
  public get getDescription(): string {
    return this.description;
  }
  public get getImageUrl(): string {
    return this.imageUrl;
  }
  public get getUserId(): number {
    return this.userId;
  }
}
