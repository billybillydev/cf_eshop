import { CreateCustomerDTO, CustomerDTO } from "$domain/dtos/customer";
import { FavoriteEntity } from "$domain/entities/favorite";
import { OrderEntity } from "$domain/entities/order";
import { EmailObject, IdObject, PasswordObject } from "$domain/value-objects";

export class CustomerEntity {
  id: IdObject;
  username: string;
  firstname: string;
  email: EmailObject;
  password: PasswordObject;
  readonly createdAt: number = Date.now();
  updatedAt: number = Date.now();
  orders: OrderEntity[] = [];
  favorites: FavoriteEntity[] = [];

  constructor(dto: CustomerDTO) {
    this.id = new IdObject(dto.id);
    this.username = dto.username;
    this.firstname = dto.firstname;
    if (!new EmailObject(dto.email).isValid()) {
      throw new Error("Email is invalid");
    }
    this.email = new EmailObject(dto.email);
    if (dto.createdAt) {
      this.createdAt = dto.createdAt;
    }
    if (dto.updatedAt) {
      this.updatedAt = dto.updatedAt;
    }
    this.password = new PasswordObject(dto.password);
  }

  transformToDTO(): CustomerDTO {
    return {
      id: this.id.value(),
      username: this.username,
      firstname: this.firstname,
      email: this.email.toString(),
      password: this.password.toString(),
      orders: this.orders,
      favorites: this.favorites,
    };
  }

  static build(dto: CreateCustomerDTO & { id: number }): CustomerEntity {
    return new CustomerEntity({
      id: dto.id,
      username: dto.username,
      firstname: dto.firstname,
      email: dto.email,
      password: dto.password,
      orders: [],
      favorites: [],
    });
  }
}
