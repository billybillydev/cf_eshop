import { UserDTO } from "$domain/dtos/user/user.dto";
import { EmailObject, IdObject } from "$domain/value-objects";

export class UserEntity {
  id: IdObject;
  username: string;
  firstname: string;
  email: EmailObject;
  password: string;
  readonly createdAt: number = Date.now();
  updatedAt: number = Date.now();

  constructor(userData: {
    id: IdObject;
    username: string;
    firstname: string;
    email: EmailObject;
    password: string;
    createdAt?: number;
    updatedAt?: number;
  }) {
    this.id = userData.id;
    this.username = userData.username;
    this.firstname = userData.firstname;
    if (!userData.email.isValid()) {
      throw new Error("Email is invalid");
    }
    this.email = userData.email;
    this.password = userData.password;
    if (userData.createdAt) {
      this.createdAt = userData.createdAt;
    }
    if (userData.updatedAt) {
      this.updatedAt = userData.updatedAt;
    }
  }

  transformToDTO(): UserDTO {
    return {
      id: this.id.value(),
      username: this.username,
      firstname: this.firstname,
      email: this.email.toString(),
      password: this.password,
    };
  }

  static transformToEntity(userDTO: UserDTO): UserEntity {
    return new UserEntity({
      ...userDTO,
      id: new IdObject(userDTO.id),
      email: new EmailObject(userDTO.email),
    });
  }
}
