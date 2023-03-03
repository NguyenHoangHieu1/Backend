import ProductInterface from "./Product";

export default interface orderItemInterface {
  orderItemId: string;
  productId: string;
  quantity: number;
  price: number;
  orderId: string;
  product?: ProductInterface;
}
