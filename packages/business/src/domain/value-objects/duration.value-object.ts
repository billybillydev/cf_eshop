import { DurationUnit } from "@mosidev/dat";

export class DurationValueObject {
  value: number;
  unit: DurationUnit;

  constructor(value: number, unit: DurationUnit) {
    this.value = value;
    this.unit = unit;
  }

  format(): string {
    return `${this.value} ${this.unit}`;
  }
}
