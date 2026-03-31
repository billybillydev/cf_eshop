import { OrderDTO } from "$domain/dtos/order.dto";
import { CartEntity } from "$domain/entities/cart/cart.entity";
import {
  AddressValueObject,
  DeliveryMethodValueObject,
  IdObject,
  PriceObject,
  RefundValueObject,
} from "$domain/value-objects";
import { PersonValueObject } from "$domain/value-objects/person.value-object";
import { Dat } from "@mosidev/dat";

export type PaymentMethod = "cb" | "paypal";
export type Fullfillment = "snoozed" | "packaging" | "ongoing" | "delivered";

export type OrderBuyer =
  | {
      type: "guest";
      data: PersonValueObject;
    }
  | {
      type: "user";
      userId: string;
    };

export class OrderEntity {
  id: IdObject;
  buyer?: OrderBuyer;
  readonly cart: CartEntity;
  shippingAddress?: AddressValueObject;
  billingAddress?: AddressValueObject;
  deliveryMethod?: DeliveryMethodValueObject;
  paymentMethod: PaymentMethod = "cb";
  charges: PriceObject;
  fullfillment: Fullfillment = "packaging";
  refund: RefundValueObject;
  paid = false;
  paidAt?: number;

  constructor(id: OrderDTO["id"], cart: CartEntity) {
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error(
        "Order cannot be created without a cart containing items"
      );
    }
    this.id = new IdObject(id)
    this.cart = cart;
    this.charges = cart.calculateTotalPrice();
    this.refund = new RefundValueObject("snoozed", 14, "day");
  }

  setBuyer(buyer: OrderBuyer) {
    if (buyer.type === "guest") {
      this.buyer = {
        type: "guest",
        data: buyer.data,
      };
    } else {
      this.buyer = {
        type: "user",
        userId: buyer.userId,
      };
    }
  }

  setShippingAddress(data: AddressValueObject) {
    this.shippingAddress = data;
  }

  setBillingAddress(data: AddressValueObject) {
    this.billingAddress = data;
  }

  setDeliveryMethod(method: DeliveryMethodValueObject) {
    this.deliveryMethod = method;
  }

  setPaymentMethod(method: PaymentMethod) {
    this.paymentMethod = method;
  }

  pay(): void {
    if (!this.buyer) {
      throw new Error("Buyer must be set before paying");
    }
    if (!this.shippingAddress) {
      throw new Error("Shipping address must be set before paying");
    }
    if (!this.billingAddress) {
      throw new Error("Billing address must be set before paying");
    }
    if (!this.deliveryMethod) {
      throw new Error("Delivery method must be set before paying");
    }
    this.fullfillment = "packaging";
    this.paidAt = Dat.now();
    this.paid = true;
  }
}
