import { AppBindings } from "$config/bindings";
import { db as $db } from "$db";

export class D1DBRepository {
  protected readonly db: ReturnType<typeof $db>;

  constructor(bindingName: AppBindings["DB"]) {
    this.db = $db(bindingName);
  }
}
