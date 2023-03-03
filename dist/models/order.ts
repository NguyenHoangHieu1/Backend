export default class Order {
  constructor(private userId: string, private orderId: string) {}
  public get getUserId(): string {
    return this.userId;
  }
  public get getOrderId(): string {
    return this.orderId;
  }
}
