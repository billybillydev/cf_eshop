import { SanitizedCustomerDTO } from "$domain/dtos";
import { OrderEntity } from "$domain/entities/order";
import { EmailObject, FavoriteVO, IdObject } from "$domain/value-objects";
import { Dat } from "@mosidev/dat";

export class SanitizedCustomerEntity {
  id: IdObject;
  username: string;
  firstname: string;
  email: EmailObject;
  readonly createdAt: number;
  updatedAt: number;
  orders: OrderEntity[] = [];
  favorites: Array<FavoriteVO> = [];

  constructor(dto: SanitizedCustomerDTO) {
    this.id = new IdObject(dto.id);
    this.username = dto.username;
    this.firstname = dto.firstname;
    this.email = new EmailObject(dto.email);
    this.createdAt = dto.createdAt ?? Dat.now();
    this.updatedAt = dto.updatedAt ?? Dat.now();
    this.orders = dto.orders;
    this.favorites = dto.favorites.map((favorite) => new FavoriteVO(favorite));
  }

  fullName(): string {
    return `${this.firstname} ${this.username}`;
  }

  transformToDTO(): SanitizedCustomerDTO {
    return {
      id: this.id.value(),
      username: this.username,
      firstname: this.firstname,
      email: this.email.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      orders: this.orders,
      favorites: this.favorites.map((favorite) => favorite.transformToDTO()),
    };
  }
}
