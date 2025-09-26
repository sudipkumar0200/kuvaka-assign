import { Router } from "express";
import { saveOffer } from "../controllers/offer";

const router = Router();

router.post("/",  saveOffer);
export default router;
