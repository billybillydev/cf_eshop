import { DurationValueObject } from "$domain/value-objects/duration.value-object";

export class DeliveryMethodValueObject {
  id: string;
  name: string;
  deliveryTime: DurationValueObject;

  constructor(id: string, name: string, ...deliveryTime: ConstructorParameters<typeof DurationValueObject>) {
    this.id = id;
    this.name = name;
    this.deliveryTime = new DurationValueObject(...deliveryTime);
  }

  estimateDelivery(): string {
    return this.deliveryTime.format();
  }
}
