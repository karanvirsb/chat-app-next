import { NextApiRequest, NextApiResponse } from "next";

import {
  createGroupUserUC,
  deleteGroupUserUC,
  updateGroupUserUC,
} from "@/server/Features/groupUsers/slice";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method?.toUpperCase() === "POST") {
    await createGroupUserRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "DELETE") {
    await deleteGroupUserRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "PUT") {
    await updateGroupUserRequest(req, res, headers);
  }
}

async function createGroupUserRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    console.log(req.body);
    const gId = req.body.groupId as string;
    const uId = req.body.userId as string;
    const createdGroupUser = await createGroupUserUC({
      gId,
      uId,
      lastChecked: new Date(),
      roles: ["2001"],
    });
    res.json({
      headers,
      statusCode: 200,
      body: createdGroupUser,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error,
      },
    });
  }
}

async function deleteGroupUserRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const groupId = req.query.groupId as string;
    const userId = req.query.userId as string;
    const deletedGroupUser = await deleteGroupUserUC({ groupId, userId });
    res.json({
      headers,
      statusCode: 200,
      body: deletedGroupUser,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error,
      },
    });
  }
}

async function updateGroupUserRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const groupId = req.body.groupId as string;
    const userId = req.body.userId as string;
    const updates = req.body.updates;
    const updatedGroupUser = await updateGroupUserUC({
      groupId,
      userId,
      updates,
    });
    res.json({
      headers,
      statusCode: 200,
      body: updatedGroupUser,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error,
      },
    });
  }
}
