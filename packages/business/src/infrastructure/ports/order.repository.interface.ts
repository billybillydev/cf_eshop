import type { OrderEntity } from "$domain/entities/order/order.entity";

export interface OrderRepositoryInterface {
  create(order: OrderEntity): Promise<OrderEntity>;
}
