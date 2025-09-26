import { Router } from "express";
import multer from "multer";
import { parseCSVLeads } from "../controllers/leads";

const upload = multer({ dest: "/temp" });
const router = Router();

/**
 * POST /upload
 * Uploads a CSV file containing leads, parses it, and stores in memory.
 * Expects: multipart/form-data with field "file"
 * Returns: { message: string, count: number }
 */
router.post("/upload", upload.single("file"), parseCSVLeads);

export default router;
