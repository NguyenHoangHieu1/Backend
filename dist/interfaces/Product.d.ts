export default interface ProductInterface {
  product_id: string;
  imageUrl: string;
  title: string;
  price: number;
  description: string;
  quantity?: number;
  userId: number;
}
