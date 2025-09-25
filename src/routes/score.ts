import { Router } from "express";
import {
  runScoring,
  getResults,
  downloadResultsCsv,
} from "../controllers/score";
const router = Router();

router.post("/", runScoring);
router.get("/results", (req, res) => res.json(getResults()));
router.get("/results/csv", downloadResultsCsv);

export default router;
