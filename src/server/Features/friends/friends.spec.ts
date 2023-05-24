import { ZodError } from "zod";

import id from "@/server/Utilities/id";

import buildFriends from ".";
import { IFriends } from "./friends";

describe("Friends test", () => {
  test("SUCCESS: created friends successfully", () => {
    const friend = buildFriends({
      userId: id.makeId(),
      friendId: id.makeId(),
      dateAdded: new Date(),
    });

    expect(friend.success).toBeTruthy();
  });

  test("ERROR: user id does not exist", () => {
    const result = buildFriends({
      userId: "",
      friendId: id.makeId(),
      dateAdded: new Date(),
    });
    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError<IFriends>) {
        const err = (result.error as ZodError<IFriends>).flatten().fieldErrors;
        console.log(err);
        expect(err.userId?.join("")).toBe("Invalid uuid");
      }
    }
  });

  test("ERROR: friends id does not exist", () => {
    const result = buildFriends({
      userId: id.makeId(),
      friendId: "",
      dateAdded: new Date(),
    });
    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      if (result.error instanceof ZodError<IFriends>) {
        const err = (result.error as ZodError<IFriends>).flatten().fieldErrors;
        console.log(err);
        expect(err.friendId?.join("")).toBe("Invalid uuid");
      }
    }
  });
});
