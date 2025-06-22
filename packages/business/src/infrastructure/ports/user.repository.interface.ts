import { CreateUserDTO } from "$domain/dtos";
import { UserEntity } from "$domain/entities";
import { EmailObject } from "$domain/value-objects";

export interface UserRepositoryInterface {
    isAdmin(email: EmailObject): Promise<boolean>;
    getByEmail(email: EmailObject, password: string): Promise<UserEntity | null>;
    create(userData: CreateUserDTO): Promise<UserEntity | null>;
}