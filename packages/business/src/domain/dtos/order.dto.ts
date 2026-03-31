import { OrderEntity } from "$domain/entities";

export type OrderDTO = {
    id: ReturnType<OrderEntity["id"]["value"]>,
    buyer: OrderEntity["buyer"],
    cart: OrderEntity["cart"],
    shippingAddress: OrderEntity["shippingAddress"],
    billingAddress: OrderEntity["billingAddress"],
    deliveryMethod: OrderEntity["deliveryMethod"],
    paymentMethod: OrderEntity["paymentMethod"],
    charges: OrderEntity["charges"],
    fullfillment: OrderEntity["fullfillment"],
    refund: OrderEntity["refund"],
    paid: OrderEntity["paid"],
    paidAt: OrderEntity["paidAt"],
}