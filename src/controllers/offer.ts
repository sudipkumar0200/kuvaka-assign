import { Request, Response } from "express";
import { Offer } from "../types";

let currentOffer: Offer | null = null;

export const saveOffer = (req: Request, res: Response) => {
  const body = req.body as Offer;
  currentOffer = body;
  res.json({ message: "Offer saved", offer: currentOffer });
};

export const getOffer = (): Offer | null => currentOffer;