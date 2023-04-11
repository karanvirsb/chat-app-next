import {
  deleteGroupUserUC,
  updateGroupUserUC,
} from "@/server/Features/groupUsers/slice";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method?.toUpperCase() === "DELETE") {
    await deleteGroupUserRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "PUT") {
    await updateGroupUserRequest(req, res, headers);
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
  } catch (error: any) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error: error.message,
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
  } catch (error: any) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error: error.message,
      },
    });
  }
}
