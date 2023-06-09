import { NextApiRequest, NextApiResponse } from "next";

import { updateGroupUC } from "@/server/Features/group/updateGroup";
import { addGroup } from "@/server/Features/group/use-cases";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method === "POST") {
    await addGroupRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "PUT") {
    await updateGroupRequest(req, res, headers);
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

async function updateGroupRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const { groupId, updates } = req.body;
    const updatedGroup = await updateGroupUC({ groupId, updates });
    res.json({
      headers,
      statusCode: 200,
      body: updatedGroup,
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
