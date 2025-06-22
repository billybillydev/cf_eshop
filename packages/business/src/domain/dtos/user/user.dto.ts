import { UserEntity } from "$domain/entities"

export type UserDTO = {
    id: ReturnType<UserEntity["id"]["value"]>,
    username: UserEntity["username"],
    firstname: UserEntity["firstname"],
    email: ReturnType<UserEntity["email"]["toString"]>,
    password: UserEntity["password"]
}