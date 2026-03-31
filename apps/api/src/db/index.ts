import { AppBindings } from "$config/bindings";
import * as schema from "$db/schemas";
import { drizzle } from "drizzle-orm/d1";

export const db = (bindingName: AppBindings["DB"]) => drizzle(bindingName, { schema });