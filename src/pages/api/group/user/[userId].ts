import { NextApiRequest, NextApiResponse } from "next";

import { getGroupsByUserId } from "@/server/Features/group/use-cases";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method === "GET") {
    await getGroupsByUserIdRequest(req, res, headers);
  }
}

async function getGroupsByUserIdRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const userId = req.query.userId as string;
    const foundGroups = await getGroupsByUserId(userId);
    res.json({
      headers,
      statusCode: 200,
      body: foundGroups,
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
