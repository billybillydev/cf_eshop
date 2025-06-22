import { config } from "$config";
import { db } from "$db";
import { User, userSchema } from "$db/schemas/user.schema";
import { compare, hash } from 'bcrypt'
import { CreateUserDTO } from "@eshop/business/domain/dtos";
import { UserEntity } from "@eshop/business/domain/entities";
import {
  EmailObject,
  IdObject,
} from "@eshop/business/domain/value-objects";
import { UserRepositoryInterface } from "@eshop/business/infrastructure/ports";

export class UserRepository implements UserRepositoryInterface {
  async isAdmin(email: EmailObject): Promise<boolean> {
    const user = await db.query.userSchema.findFirst({
      where: (fields, { eq }) => eq(fields.email, email.toString()),
    });
    if (!user) {
      console.error("User does not exist");
      return Promise.resolve(false);
    }

    return Promise.resolve(email.equals(new EmailObject(config.adminEmail)));
  }
  async getByEmail(
    email: EmailObject,
    password: string
  ): Promise<UserEntity | null> {
    if (!email.isValid()) {
      console.error("Invalid email");
      
      return Promise.resolve(null);
    }
    const user = await db.query.userSchema.findFirst({
      where: (fields, { eq }) => eq(fields.email, email.toString()),
    });

    if (!user) {
      return Promise.resolve(null);
    }

    if (!(await compare(password, user.password))) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.convertModelToEntity(user));
  }
  async create(userData: CreateUserDTO): Promise<UserEntity | null> {
    if (
      await this.getByEmail(new EmailObject(userData.email), userData.password)
    ) {
      console.error("User already exists");
      return Promise.resolve(null);
    }

    const [createdUser] = await db
      .insert(userSchema)
      .values({
        username: userData.username,
        firstname: userData.firstname,
        email: userData.email,
        password: await hash(userData.password, 10),
      })
      .returning();

    return this.convertModelToEntity(createdUser);
  }

  private convertModelToEntity(user: User): UserEntity {
    return new UserEntity({
      id: new IdObject(user.id),
      username: user.username,
      firstname: user.firstname,
      email: new EmailObject(user.email),
      password: user.password,
    });
  }
}
