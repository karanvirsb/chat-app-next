import { clearDb, closeDb } from "@/server/__test__/fixures/db";
import makeFakeUser from "@/server/__test__/fixures/user";
import userTests from "@/server/__test__/functions/user";

import { addUserUC } from "../AddUser";
import { editAnUser } from ".";

describe("Edit user controller", () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    const createdUser = userTests.addTestUserToDB({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  afterEach(async () => {
    await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  jest.setTimeout(3000);
  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
    await closeDb();
  });

  it("edit user ", async () => {
    const user = await makeFakeUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
    const resp = await addUserUC(user);
    const edittedUser = await editAnUser({
      body: {
        id: "312c0878-04c3-4585-835e-c66900ccc7a1",
        updates: { status: "offline" },
      },
      headers: {},
      ip: "string",
      method: "GET",
      params: {},
      path: "",
      query: {},
    });

    expect(edittedUser.body.data.status).toBe("offline");
  });
});
