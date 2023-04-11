import { IGroup } from "@/server/Features/group/group";
import {
  addGroup,
  deleteGroup,
  getGroupById,
} from "@/server/Features/group/use-cases";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method === "POST") {
    await addGroupRequest(req, res, headers);
  } else if (req.method === "GET") {
    await getGroupRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "DELETE") {
    await deleteGroupRequest(req, res, headers);
  }
}
async function addGroupRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const addedGroup = await addGroup(req.body.groupInfo, req.body.userId);
    res.json({
      headers,
      statusCode: 200,
      body: addedGroup,
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

async function getGroupRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const groupId = req.query.groupId as string;
    const foundGroup = await getGroupById(groupId);
    res.json({
      headers,
      statusCode: 200,
      body: foundGroup,
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

async function deleteGroupRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const groupId = req.query.groupId as string;
    const deletedGroup = await deleteGroup(groupId);
    res.json({
      headers,
      statusCode: 200,
      body: deletedGroup,
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
