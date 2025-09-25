import { Router } from "express";
import offerRouter from "../routes/offer";
import leadsRouter from "../routes/leads";
import scoreRouter from "../routes/score"


const router = Router();

router.use("/offer", offerRouter);
router.use("/leads", leadsRouter);
router.use("/score", scoreRouter);

export default router;