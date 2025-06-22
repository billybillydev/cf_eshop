import { UserDTO } from "$domain/dtos/user/user.dto";

export type CreateUserDTO = Omit<
    UserDTO,
    "id" | "createdAt" | "updatedAt"
>;