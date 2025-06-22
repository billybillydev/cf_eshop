import { CreateUserDTO } from "$domain/dtos";
import { UserEntity } from "$domain/entities";
import { UserRepositoryInterface } from "$infrastructure/ports/user.repository.interface";

export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepositoryInterface) {}

    async execute(userData: CreateUserDTO): Promise<UserEntity | null> {
        return this.userRepository.create(userData);
    }
}