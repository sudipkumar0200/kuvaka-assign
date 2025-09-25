import { Request, Response } from "express";
import { Offer } from "../types";
import { offerSchema } from "../config/offer";

let currentOffer: Offer | null = null;

export const saveOffer = (req: Request, res: Response) => {
  const body = offerSchema.safeParse(req.body);
  if (!body.success) {
    res.json({ message: "Invalid arguments!!" });
    return;
  }
  currentOffer = body.data;
  res.json({ message: "Offer saved", offer: currentOffer });
};

export const getOffer = (): Offer | null => currentOffer;
