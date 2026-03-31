import { DurationValueObject } from "$domain/value-objects/duration.value-object";

export type RefundState = "requested" | "refunded" | "canceled" | "snoozed";

export class RefundValueObject {
  state: RefundState;
  delay: DurationValueObject;

  constructor(state: RefundState, ...delay: ConstructorParameters<typeof DurationValueObject>) {
    this.state = state;
    this.delay = new DurationValueObject(...delay);
  }
}
