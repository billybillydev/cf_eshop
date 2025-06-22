import { UserEntity } from "$domain/entities";
import { EmailObject } from "$domain/value-objects";
import { UserRepositoryInterface } from "$infrastructure/ports/user.repository.interface";

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(email: string, password: string): Promise<UserEntity | null> {
    return this.userRepository.getByEmail(
      new EmailObject(email),
      password
    );
  }
}
