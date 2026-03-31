import type { CartEntity } from "$domain/entities";
import type { OrderEntity } from "$domain/entities/order/order.entity";
import type { OrderRepositoryInterface } from "$infrastructure/ports";

export class MakeOrderUseCase {
  private readonly orderRepository!: OrderRepositoryInterface;

  constructor(orderRepository: OrderRepositoryInterface) {
    this.orderRepository = orderRepository;
  }

  async execute(order: OrderEntity): Promise<OrderEntity> {
    return this.orderRepository.create(order);
  }
}
