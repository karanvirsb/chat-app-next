import { IGroupDb } from ".";
import { IGroup } from "../group";

type props = {
  makeDb: IGroupDb["makeDb"];
};

export type groupUsers = {
  gId: string;
  uId: string;
  roles: number[];
};

type returningGroupData = Promise<{
  success: boolean;
  data: IGroup | undefined;
  error: string;
}>;

type returningGroups = Promise<{
  success: boolean;
  data: IGroup[] | undefined;
  error: string;
}>;

type returningGroupUserData = Promise<{
  success: boolean;
  data: groupUsers | undefined;
  error: string;
}>;

export type user = {
  userId: string;
  username: string;
  status: string;
  email: string;
  time_joined: Date;
  roles: string[];
  groupId: string;
};

type returningUser = Promise<{
  success: boolean;
  data: user | undefined;
  error: string;
}>;

type returningUsers = Promise<{
  success: boolean;
  data: user[] | undefined;
  error: string;
}>;

export interface IMakeGroupDb {
  returnType: Readonly<{
    findById: (id: string) => Promise<returningGroupData>;
    createGroup: (
      groupInfo: IGroup,
      userId: string
    ) => Promise<returningGroupData>;
    updateGroupName: (
      groupId: string,
      groupName: string
    ) => Promise<returningGroupData>;
    removeGroup: (groupId: string) => Promise<returningGroupData>;
    updateInviteCode: (
      groupId: string,
      newCode: string
    ) => Promise<returningGroupData>;
    findByInviteCode: (inviteCode: string) => Promise<returningGroupData>;
    findUsersByGroupId: (groupId: string) => Promise<returningUsers>;
    addUserToGroup: (
      groupId: string,
      userId: string,
      roles: string[]
    ) => Promise<returningUser>;
    removeUserFromGroup: (
      groupId: string,
      userId: string
    ) => Promise<returningGroupUserData>;
    findGroupsByUserId: (userId: string) => returningGroups;
  }>;
}

export default function makeGroupDb({
  makeDb,
}: props): IMakeGroupDb["returnType"] {
  return Object.freeze({
    findById,
    createGroup,
    updateGroupName,
    removeGroup,
    updateInviteCode,
    findByInviteCode,
    findUsersByGroupId,
    addUserToGroup,
    removeUserFromGroup,
    findGroupsByUserId,
  });

  // Find group by id
  async function findById(id: string): Promise<returningGroupData> {
    const db = await makeDb();
    try {
      const query = `SELECT * FROM groupt WHERE "groupId" = '${id}'`;
      const res = await db.query(query);

      if (res.rowCount === 1) {
        const group: IGroup = res.rows[0];
        return { success: true, data: group, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find any user with that id",
        };
      }
    } catch (error) {
      console.log("🚀 ~ file: group-db.ts ~ line 35 ~ findById ~ error", error);
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
  // create group
  async function createGroup(
    groupInfo: IGroup,
    userId: string
  ): Promise<returningGroupData> {
    const db = await makeDb();
    try {
      const query = `INSERT INTO groupt VALUES ($1, $2, $3) RETURNING *;`;
      const result = await db.query(query, [
        groupInfo.groupId,
        groupInfo.groupName,
        groupInfo.inviteCode,
      ]);
      // TODO add group users use case
      if (result.rows.length >= 1) {
        const group = result.rows[0];
        return { success: true, data: group, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not insert group",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 75 ~ createGroup ~ error",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
  // Edit group name

  async function updateGroupName(
    groupId: string,
    groupName: string
  ): Promise<returningGroupData> {
    const db = await makeDb();
    try {
      const query = `UPDATE groupt SET "groupName" = '${groupName}' WHERE "groupId" = '${groupId}' RETURNING *`;
      const res = await db.query(query);
      if (res.rows.length > 0) {
        const updatedGroup: IGroup = res.rows[0];
        return { success: true, data: updatedGroup, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not update group name",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 107 ~ updateGroupName ~ error",
        error
      );
      return { success: false, data: undefined, error: error + "" };
    } finally {
      db.release();
    }
  }

  // delete group

  async function removeGroup(groupId: string): Promise<returningGroupData> {
    const db = await makeDb();
    try {
      const query = `DELETE FROM groupt WHERE "groupId" = '${groupId}' RETURNING *`;
      const res = await db.query(query);
      if (res.rows.length > 0) {
        const deletedGroup: IGroup = res.rows[0];
        return { success: true, data: deletedGroup, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not update group name",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 146 ~ removeGroup ~ error",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }

  // Regenerate invite code

  async function updateInviteCode(
    groupId: string,
    newCode: string
  ): Promise<returningGroupData> {
    const db = await makeDb();
    try {
      const query = `UPDATE groupt SET "inviteCode" = '${newCode}' WHERE "groupId" = '${groupId}' RETURNING *;`;
      const res = await db.query(query);
      console.log("🚀 ~ file: group-db.ts ~ line 238 ~ res", res);

      if (res.rows.length >= 1) {
        const group: IGroup = res.rows[0];
        group.inviteCode = newCode;
        return {
          success: true,
          data: group,
          error: "",
        };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not regenerate invite code",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 179 ~ updateInviteCode ~ error",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }

  // find group based on invite code
  async function findByInviteCode(
    inviteCode: string
  ): Promise<returningGroupData> {
    const db = await makeDb();
    try {
      const query = `SELECT * FROM groupt WHERE "inviteCode" = '${inviteCode}'`;
      const res = await db.query(query);
      if (res.rows.length >= 1) {
        const group: IGroup = res.rows[0];
        return {
          success: true,
          data: group,
          error: "",
        };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find group with that invite code",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 219 ~ findByInviteCode ~ error",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }

  // get groups by user id
  async function findGroupsByUserId(userId: string): returningGroups {
    const db = await makeDb();
    try {
      const query = `
            SELECT * FROM groupt 
            WHERE "groupId" IN (
                SELECT "gId" FROM "groupUsers" 
                WHERE "uId" = '${userId}'
                )
            ORDER BY "dateCreated" DESC;`;

      const res = await db.query(query);

      if (res.rows.length >= 1) {
        const groups: IGroup[] = res.rows;
        return {
          success: true,
          data: groups,
          error: "",
        };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find any groups.",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 328 ~ findGroupsByUserId ~ error",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }

  // find user group
  async function findUsersByGroupId(groupId: string): Promise<returningUsers> {
    const db = await makeDb();
    try {
      const query = `
            SELECT U."userId", U.username, U.status, E.email, E.time_joined, G."roles", G."gId" AS "groupId" 
            FROM usert U 
                LEFT JOIN emailpassword_users E 
                    ON U."userId" = E.user_id 
                LEFT JOIN  "groupUsers" G
                    ON U."userId" = G."uId"
            WHERE g."gId" = '${groupId}'
            `;

      // WHERE U."userId" IN (
      //     SELECT "uId"
      //     FROM "groupUsers" G
      //     WHERE "gId" = '${groupId}'
      //     );

      const res = await db.query(query);

      if (res.rows.length >= 1) {
        const users: user[] = res.rows;
        return {
          success: true,
          data: users,
          error: "",
        };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find any users",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 294 ~ findUsersByGroupId ~ error",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }

  // Add user to group
  async function addUserToGroup(
    groupId: string,
    userId: string,
    roles: string[]
  ): Promise<returningUser> {
    const db = await makeDb();
    try {
      const query = `
            WITH insertedUser AS (
                INSERT INTO "groupUsers" VALUES(
                    '${groupId}',
                    '${userId}', 
                    ARRAY[${roles.join(",")}]
                ) RETURNING *
            )
            
            SELECT U."userId", U.username, U.status, E.email, E.time_joined, (SELECT "roles" FROM insertedUser), (SELECT "gId" AS "groupId" from insertedUser) 
            FROM usert U 
                JOIN emailpassword_users E 
                    ON U."userId" = E.user_id
            WHERE U."userId" = '${userId}'`;

      // const joinedRoles = roles.join(", ");
      const res = await db.query(query);

      if (res.rows.length >= 1) {
        const groupUser: user = res.rows[0];
        return {
          success: true,
          data: groupUser,
          error: "",
        };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not add user to the group.",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: group-db.ts ~ line 280 ~ addUserToGroup ~ error",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
  // remove user from group
  async function removeUserFromGroup(
    groupId: string,
    userId: string
  ): Promise<returningGroupUserData> {
    const db = await makeDb();
    try {
      const query = `DELETE FROM "groupUsers" WHERE "gId" = '${groupId}' AND "uId" = '${userId}' RETURNING *`;
      const res = await db.query(query);
      if (res.rows.length >= 1) {
        const groupUser: groupUsers = res.rows[0];
        return {
          success: true,
          data: groupUser,
          error: "",
        };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not remove user from the group.",
        };
      }
    } catch (error) {
      console.log("🚀 ~ file: group-db.ts ~ line 314 ~ error", error);

      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
}
