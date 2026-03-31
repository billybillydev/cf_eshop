import { EmailObject } from "@eshop/business/domain/value-objects";
import { SendContactEmailUseCase } from "@eshop/business/domain/usecases/email";
import { InMemoryEmailRepository } from "@eshop/business/infrastructure/adapters/in-memory";

export const useSendContactEmail = async (
  name: string,
  email: string,
  message: string
) => {
  try {
    const emailRepository = new InMemoryEmailRepository();
    const sendContactEmailUseCase = new SendContactEmailUseCase(emailRepository);
    const res = await sendContactEmailUseCase.execute(
      name,
      new EmailObject(email),
      message
    );
    return res;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
