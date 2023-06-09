import { NextApiRequest, NextApiResponse } from "next";

import { getUsersByGroupId } from "@/server/Features/group/use-cases";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method === "GET") {
    await getUsersByGroupIdRequest(req, res, headers);
  }
}

async function getUsersByGroupIdRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const groupId = req.query.groupId as string;
    const users = await getUsersByGroupId(groupId);
    res.json({
      headers,
      statusCode: 200,
      body: users,
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
