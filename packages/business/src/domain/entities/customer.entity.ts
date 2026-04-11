import { CreateCustomerDTO, CustomerDTO } from "$domain/dtos/customer";
import { OrderEntity } from "$domain/entities/order";
import { EmailObject, IdObject, PasswordObject } from "$domain/value-objects";
import { FavoriteVO } from "$domain/value-objects/favorite.value-object";

export class CustomerEntity {
  id: IdObject;
  username: string;
  firstname: string;
  email: EmailObject;
  password: PasswordObject;
  readonly createdAt: number = Date.now();
  updatedAt: number = Date.now();
  orders: OrderEntity[] = [];
  favorites: Array<FavoriteVO> = [];

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
    this.orders = dto.orders;
    this.favorites = dto.favorites.map((favorite) => new FavoriteVO(favorite));
  }

  transformToDTO(): CustomerDTO {
    return {
      id: this.id.value(),
      username: this.username,
      firstname: this.firstname,
      email: this.email.toString(),
      password: this.password.toString(),
      orders: this.orders,
      favorites: this.favorites.map((favorite) => favorite.transformToDTO()),
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
