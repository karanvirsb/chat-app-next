import { z } from "zod";

import { EntityReturn } from "@/shared/types/returns";

type props = {
  sanitizeText: (text: string) => string;
};

const UserSchema = z.object({
  userId: z.string().uuid(),
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters long.")
    .max(30, "Username cannot be more than 30 characters long."),
  status: z.enum(["online", "offline"]),
  password: z
    .string()
    .regex(/[A-Z]{1,}/, "Password must contain atleast 1 capital letter.")
    .regex(/[a-z]{1,}/, "Password must contain atleast 1 lower case letter.")
    .regex(/[0-9]{1,}/, "Password must contain atleast 1 number")
    .regex(
      /[#?!@$%^&*-]{1,}/,
      "Password must contain atleast 1 special character, allowed: # ? ! @ $ % ^ & * -"
    )
    .min(8, "Password must be 8 characters long")
    .max(50, "Password cannot be longer than 50 characters"),
  // .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, ""),
});

export type IUser = z.infer<typeof UserSchema>;

type MarkDeleted = {
  markedDeleted: () => void;
};
type IsDeleted = {
  isDelete: () => boolean;
};

export default function buildUser({ sanitizeText }: props) {
  return function makeUser({
    userId,
    username,
    status,
    password,
  }: IUser): EntityReturn<IUser> {
    const sanitizedText = sanitizeText(username).trim();
    if (sanitizedText !== username) {
      return {
        success: false,
        error: "Username does not contain any valid characters.",
      };
    }

    const result = UserSchema.safeParse({
      userId,
      username: sanitizedText,
      status,
      password,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const deletedUsername = "Deleted :`(";
    return {
      success: true,
      data: Object.freeze({
        getUserId: () => userId,
        getUsername: () => sanitizedText,
        getStatus: () => status,
        getPassword: () => password,
      }),
    };
  };
}
