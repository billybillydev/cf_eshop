import { OrderEntity } from "$domain/entities/order/order.entity";
import type { OrderRepositoryInterface } from "$infrastructure/ports";

export class InMemoryOrderRepository implements OrderRepositoryInterface {
  private orders: OrderEntity[] = [];

  async create(order: OrderEntity): Promise<OrderEntity> {
    order.pay();
    this.orders.push(order);
    return Promise.resolve(order);
  }
}
