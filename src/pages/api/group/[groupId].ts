import { NextApiRequest, NextApiResponse } from "next";

import { deleteGroup, getGroupById } from "@/server/Features/group/use-cases";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method === "GET") {
    await getGroupRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "DELETE") {
    await deleteGroupRequest(req, res, headers);
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
