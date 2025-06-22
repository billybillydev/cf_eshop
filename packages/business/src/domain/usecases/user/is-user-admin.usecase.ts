import { EmailObject } from "$domain/value-objects";
import { UserRepositoryInterface } from "$infrastructure/ports/user.repository.interface";

export class IsUserAdminUseCase {
    constructor(private readonly userRepository: UserRepositoryInterface) {}

    async execute(email: string): Promise<boolean> {
        return this.userRepository.isAdmin(new EmailObject(email));
    }
}