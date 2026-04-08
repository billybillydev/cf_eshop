import { CustomerEntity } from "$domain/entities"

export type CustomerDTO = {
    id: ReturnType<CustomerEntity["id"]["value"]>,
    username: CustomerEntity["username"],
    firstname: CustomerEntity["firstname"],
    email: ReturnType<CustomerEntity["email"]["toString"]>,
    password: ReturnType<CustomerEntity["password"]["toString"]>,
    createdAt?: CustomerEntity["createdAt"],
    updatedAt?: CustomerEntity["updatedAt"],
    orders: CustomerEntity["orders"],
    favorites: CustomerEntity["favorites"]
}