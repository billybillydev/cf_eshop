export type AddressParams = {
  line1: string;
  line2?: string;
  city: string;
  zipCode: string;
  country: string;
};

export class AddressValueObject {
  line1: string;
  line2?: string;
  city: string;
  zipCode: string;
  country: string;

  constructor(data: AddressParams) {
    this.line1 = data.line1;
    this.line2 = data.line2;
    this.city = data.city;
    this.zipCode = data.zipCode;
    this.country = data.country;
  }

  print(): string {
    return `${this.line1}${this.line2 ? " " + this.line2 : ""}, ${this.city}, ${this.zipCode}, ${this.country}`;
  }
}
