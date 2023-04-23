import { NextApiRequest, NextApiResponse } from "next";

import { getUser } from "@/server/Features/user/use-cases";
import { IUser } from "@/server/Features/user/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ControllerReturn<IUser>>
) {
  const userId = req.query.userId as string;
  if (req.method === "GET") {
    const foundUser = await getUser(userId);
    res.json({
      body: foundUser,
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
