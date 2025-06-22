import { CreateUserDTO } from "$domain/dtos";
import { UserEntity } from "$domain/entities";
import { EmailObject, IdObject } from "$domain/value-objects";
import { UserRepositoryInterface } from "$infrastructure/ports/user.repository.interface";
import { compare, hash } from 'bcrypt';

export class InMemoryUserRepository implements UserRepositoryInterface {
  readonly users: UserEntity[] = [];
  private readonly adminEmail = new EmailObject("admin@eshop.com");

  async getByEmail(
    email: EmailObject,
    password: string
  ): Promise<UserEntity | null> {
    if (!email.isValid()) {
      throw new Error("Invalid email");
    }
    const existingUser = this.users.find(
      (user) => user.email.toString() === email.toString()
    );

    if (!existingUser) {
      return Promise.resolve(null);
    }

    const isMatch = await compare(password, existingUser.password);

    if (!isMatch) {
      return Promise.resolve(null);
    }

    return Promise.resolve(existingUser);
  }
  async create(userData: CreateUserDTO): Promise<UserEntity | null> {
    if (this.users.some((user) => user.email.toString() === userData.email)) {
      console.error("User already exists");
      return Promise.resolve(null);
    }

    for (const field in userData) {
      if (!Reflect.get(userData, field)) {
        throw new Error(`Field ${field} is required`);
      }
    }

    const email = new EmailObject(userData.email);
    const password = await hash(userData.password, 10);

    const user = new UserEntity({
      ...userData,
      id: new IdObject(this.users.length + 1),
      email,
      password,
    });
    this.users.push(user);

    return Promise.resolve(user);
  }

  async isAdmin(email: EmailObject): Promise<boolean> {
    const user = this.users.find((user) => user.email.equals(email));

    if (!user) {
      return Promise.resolve(false);
    }

    return Promise.resolve(email.equals(this.adminEmail));
  }
}
