import { UserRepository } from "$infrastructure/repositories/user.repository";
import { EmailObject } from "@eshop/business/domain/value-objects";

export const useRegister = async (
  username: string,
  firstname: string,
  email: string,
  password: string
) => {
  const userRepository = new UserRepository();
  const res = await userRepository.register(
    username,
    firstname,
    new EmailObject(email),
    password
  );
  return res;
};
