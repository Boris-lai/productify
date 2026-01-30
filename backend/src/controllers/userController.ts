import { Request, Response } from "express";
import * as queries from "../db/queries";

import { getAuth } from "@clerk/express";

/**
 * Upserts the authenticated user into the database after validating the request body.
 *
 * Validates that `email`, `name`, and `imageUrl` are present in `req.body`, obtains the authenticated user's id via Clerk, and upserts a user record. Responds with 401 if the request is unauthenticated, 400 if validation fails, 200 with the upserted user on success, and 500 on internal error.
 *
 * @param req - Express request; `req.body` must include `email`, `name`, and `imageUrl`
 * @param res - Express response used to send HTTP status and JSON payloads
 */
export async function syncUser(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { email, name, imageUrl } = req.body;

    if (!email || !name || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Email, name, and imageUrl are required!" });
    }

    const user = await queries.upsertUser({
      id: userId,
      email: email,
      name: name,
      imageUrl: imageUrl,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
}