import { Router } from "express";
import {
  runScoring,
  getResults,
  downloadResultsCsv,
} from "../controllers/score";
const router = Router();

/**
 * POST /score
 * Runs the scoring process for uploaded leads against the saved offer
 */
router.post("/", runScoring);

/**
 * GET /score/results
 * Returns all scoring results in JSON format
 */
router.get("/results", (req, res) => res.json(getResults()));

/**
 * GET /score/results/csv
 * Downloads the scoring results as a CSV file
 */
router.get("/results/csv", downloadResultsCsv);

export default router;
