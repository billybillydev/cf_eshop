export type PersonParams = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export class PersonValueObject {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone?: string;

  constructor(data: PersonParams) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    if (data.phone) {
      this.phone = data.phone;
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
