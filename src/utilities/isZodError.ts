import { ZodError } from "zod";

export function isZodError<T>(err: unknown): err is ZodError<T> {
  return err instanceof ZodError<T>;
}
