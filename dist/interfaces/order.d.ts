import orderItemInterface from "./orderItem";

export default interface OrderInterface {
  order_id: string;
  userId: string;
  orderItems?: orderItemInterface[];
}
