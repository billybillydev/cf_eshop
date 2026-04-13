import { CustomerRepository } from "$/infrastructure/repositories/user.repository";
import { EmailObject } from "@eshop/business/domain/value-objects";

export const useLogin = async (email: string, password: string) => {
  const userRepository = new CustomerRepository();
  const res = await userRepository.login(new EmailObject(email), password);
  return res;
};
