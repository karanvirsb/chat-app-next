import { deleteUser } from "supertokens-node";
import { IUserDb } from ".";
import { IUser } from "../user";

type props = {
  makeDb: IUserDb["makeDb"];
};

type returningData = {
  type: Promise<{
    success: boolean;
    data: IUser | undefined;
    error: string;
  }>;
};

export interface IMakeUsersDb {
  returnType: Readonly<{
    findById: ({ id }: { id: string }) => returningData["type"];
    findByUsername: (username: string) => returningData["type"];
    updateByUsername: ({
      username,
      updates,
    }: {
      username: string;
      updates: Partial<Record<keyof IUser, string>>;
    }) => returningData["type"];
    updateByUserId: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<Record<keyof IUser, string>>;
    }) => returningData["type"];
    remove: (userId: string) => returningData["type"];
    insert: ({ data }: { data: IUser }) => returningData["type"];
  }>;
}

export default function makeUsersDb({ makeDb }: props) {
  return Object.freeze({
    findById,
    findByUsername,
    updateByUsername,
    updateByUserId,
    remove,
    insert,
  });

  async function findById({ id }: { id: string }): returningData["type"] {
    const db = await makeDb();
    try {
      const query = `SELECT u."userId", e.email, u.username, u.status, e.time_joined 
                            FROM userT u 
                                LEFT JOIN emailpassword_users e 
                                ON u."userId" = e.user_id 
                            WHERE u."userId"='${id}';`;
      // const query = `SELECT * FROM userT WHERE "userId" = '${id}'`;
      const res = await db.query(query);
      if (res.rows.length > 0) {
        return { success: true, data: res.rows[0], error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find any user with that id",
        };
      }
    } catch (error: any) {
      console.log(error);
      return { success: false, data: undefined, error: error };
    } finally {
      db.release();
    }
  }
  async function findByUsername(username: string): returningData["type"] {
    const db = await makeDb();
    try {
      const query = `SELECT u."userId", e.email, u.username, u.status, e.time_joined 
                            FROM userT u 
                                LEFT JOIN emailpassword_users e 
                                ON u."userId" = e.user_id 
                            WHERE u."username"='${username}';`;
      const res = await db.query(query);
      if (res.rows.length > 0) {
        return { success: true, data: res.rows[0], error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find any user with that username",
        };
      }
    } catch (err: any) {
      return { success: false, data: undefined, error: err };
    } finally {
      db.release();
    }
  }

  async function updateByUserId({
    userId,
    updates,
  }: {
    userId: string;
    updates: Partial<Record<keyof IUser, string>>;
  }): returningData["type"] {
    const db = await makeDb();
    try {
      const updateString = updateStringBuilder(updates);
      const query = `UPDATE userT SET ${updateString.trim()} WHERE "userId" = '${userId}' RETURNING *`;
      const res = await db.query(query.trim());
      if (res.rows.length > 0) {
        return { success: true, data: res.rows[0], error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not update user",
        };
      }
    } catch (error: any) {
      console.log(error);
      return { success: false, data: undefined, error: error };
    } finally {
      db.release();
    }
  }

  async function updateByUsername({
    username,
    updates,
  }: {
    username: string;
    updates: Partial<Record<keyof IUser, string>>;
  }): returningData["type"] {
    const db = await makeDb();
    try {
      const updateString = updateStringBuilder(updates);
      const query = `UPDATE userT SET ${updateString.trim()} WHERE "username" = '${username}' RETURNING *`;
      const res = await db.query(query.trim());
      if (res.rows.length > 0) {
        return { success: true, data: res.rows[0], error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not update user",
        };
      }
    } catch (error: any) {
      console.log(error);
      return { success: false, data: undefined, error: error };
    } finally {
      db.release();
    }
  }

  function updateStringBuilder(updates: { [key: string]: string }) {
    const concatString = [];
    for (const update in updates) {
      if (updates[update]) {
        concatString.push(`"${update}" = '${updates[update]}'`);
      }
    }

    return concatString.join(", ");
  }

  async function remove(userId: string): returningData["type"] {
    const db = await makeDb();
    try {
      const query = `DELETE FROM userT WHERE "userId" = '${userId}' RETURNING *`;
      const deletedUser = await deleteUser(userId);
      const res = await db.query(query);
      if (res.rows.length > 0 && deletedUser.status === "OK") {
        return { success: true, data: res.rows[0], error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not remove user with that Id",
        };
      }
    } catch (err: any) {
      console.log(err);
      return { success: false, data: undefined, error: err };
    } finally {
      db.release();
    }
  }
  async function insert({ data }: { data: IUser }): returningData["type"] {
    const db = await makeDb();
    try {
      const query =
        "INSERT INTO userT VALUES((SELECT user_id FROM emailpassword_users WHERE user_id = $1), $2, $3) RETURNING *";

      const foundUser = await findByUsername(data.username);
      if (foundUser.data !== undefined) {
        return {
          success: true,
          data: undefined,
          error: "User already exists",
        };
      }
      const res = await db.query(query, [
        data.userId,
        data.username,
        data.status,
      ]);
      if (res.rows.length > 0) {
        const user: IUser = res.rows[0];
        return { success: true, data: user, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not insert user",
        };
      }
    } catch (err: any) {
      console.log(err);
      return { success: false, data: undefined, error: err };
    } finally {
      db.release();
    }
  }
  // async function findByEmail(email: string): returningData["type"] {
  //     const db = await makeDb();
  //     try {
  //         const query = `SELECT * FROM userT WHERE email = '${email}'`;
  //         const res = await db.query(query);
  //         if (res.rows.length > 0) {
  //             return { success: true, data: res.rows[0], error: "" };
  //         } else {
  //             return {
  //                 success: true,
  //                 data: undefined,
  //                 error: "Could not find user with that email",
  //             };
  //         }
  //     } catch (err: any) {
  //         return { success: true, data: undefined, error: err };
  //     } finally {
  //         db.release();
  //     }
  // }
}
