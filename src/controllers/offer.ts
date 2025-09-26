import { Request, Response } from "express";
import { Offer } from "../types";
import { offerSchema } from "../config/offer";

//currentOffer is acting as inmemory data store
let currentOffer: Offer | null = null;

/**
 * Saves a new offer to the in-memory store after validating the request body.
 * It expects a JSON payload matching the offerSchema.
 * returns A JSON response indicating success or an error message.
 */

export const saveOffer = (req: Request, res: Response) => {
  //using safeparse to handle and validate external inputs
  const body = offerSchema.safeParse(req.body);

  // return 400 status on invalid inputs
  if (!body.success) {
    res
      .status(400)
      .json({ message: "Invalid arguments!!", error: body.error.issues });
    return;
  }
  //storing the valid offer in memory(currentOffer)
  currentOffer = body.data;

  res.json({ message: "Offer saved", offer: currentOffer });
};

//return the current offer or null if not set
export const getOffer = (): Offer | null => currentOffer;
