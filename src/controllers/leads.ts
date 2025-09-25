import { Request, Response } from "express";
import fs from "fs";
import csvParser from "csv-parser";
import { Lead } from "../types";

let uploadedLeads: Lead[] = [];

export const parseCSVLeads = (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const parsed: Lead[] = [];
  const stream = fs.createReadStream(req.file.path).pipe(csvParser());
  stream.on("data", (row: any) => {
    parsed.push({
      name: row.name || row.Name || "",
      role: row.role || row.Role || "",
      company: row.company || row.Company || "",
      industry: row.industry || row.Industry || "",
      location: row.location || row.Location || "",
      linkedin_bio: row.linkedin_bio || row.linkedin || ""
    });
  });

  stream.on("end", () => {
    uploadedLeads = parsed;
    try { fs.unlinkSync(req.file!.path); } catch(e) {}
    res.json({ message: "Uploaded", count: uploadedLeads.length });
  });

  stream.on("error", (err) => {
    res.status(500).json({ error: "CSV parse error", detail: err.message });
  });
};

export const getLeads = (): Lead[] => uploadedLeads;
export const clearLeads = () => { uploadedLeads = []; };
