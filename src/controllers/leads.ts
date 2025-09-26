import { Request, Response } from "express";
import fs from "fs";
import csvParser from "csv-parser";
import { Lead } from "../types";

let uploadedLeads: Lead[] = [];

/**
 * Parses an uploaded CSV file and extracts lead information.
 * - Supports flexible header names (name/Name, role/Role, company/Company, industry/Industry, location/Location, linkedin_bio/Linkedin_bio)
 * - Stores parsed leads in memory
 */
export const parseCSVLeads = (req: Request, res: Response) => {
  //check for required file
  if (!req.file)
    return res.status(400).json({
      error: "No file uploaded. Please use the key 'file' for the upload!!",
    });

  //validate file type
  if (!req.file.mimetype.includes("csv")) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {}
    return res
      .status(400)
      .json({ error: "Invalid file type. Only CSV allowed." });
  }

  const parsed: Lead[] = [];

  try {

    //Create a stream to read and parse the CSV file
    const stream = fs.createReadStream(req.file.path).pipe(csvParser());

    //On reading each row, map to Lead structure and add to parsed array
    stream.on("data", (row: any) => {
      parsed.push({
        name: row.name || row.Name || "",
        role: row.role || row.Role || "",
        company: row.company || row.Company || "",
        industry: row.industry || row.Industry || "",
        location: row.location || row.Location || "",
        linkedin_bio: row.linkedin_bio || row.linkedin || "",
      });
    });

    //On end of stream, save parsed leads to in-memory store and respond with message and  count
    stream.on("end", () => {
      uploadedLeads = parsed;
      try {
        fs.unlinkSync(req.file!.path);
      } catch (e) {
        console.error("File cleanup failed:", e);
      }

      if (uploadedLeads.length === 0) {
        return res.status(400).json({ error: "No valid leads found in CSV" });
      }

      res.json({
        message: "Uploaded successfully",
        count: uploadedLeads.length,
      });
    });

    //Handle any errors during file reading or parsing
    stream.on("error", (err) => {
      console.error("CSV parsing failed:", err);
      res.status(500).json({ error: "CSV parse error", detail: err.message });
    });
  } catch (err: any) {
    console.error("Unexpected error while parsing CSV:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", detail: err.message });
  }
};

export const getLeads = (): Lead[] => uploadedLeads;
export const clearLeads = () => {
  uploadedLeads = [];
};
