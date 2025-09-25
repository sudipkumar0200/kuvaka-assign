import { Router } from "express";
import multer from "multer";
import { parseCSVLeads } from "../controllers/leads";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload", upload.single("file"), parseCSVLeads);

export default router;
