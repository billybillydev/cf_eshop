import { hash, compare, genSalt } from "bcrypt";

export class PasswordObject {
  static async hash(value: string): Promise<string> {
    const saltRound = 10;
    return hash(value, await genSalt(saltRound));
  }

  static async match(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
