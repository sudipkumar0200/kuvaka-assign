import { getOffer } from "./offer";
import { getLeads, clearLeads } from "./leads";
import { scoreLead } from "../services/scoring";
import { exportCsv } from "../services/csvExport";
import fs from "fs";
import { Request, Response } from "express";

// in-memory results storage for data
let results: any[] = [];

/**
 * Runs the scoring process for all uploaded leads against the saved offer.
 *
 * Checks if an offer exists
 * Checks if leads are available
 * Calls the scoring service for each lead
 * Handles errors gracefully for failed lead scoring
 *
 * Returns JSON with scoring summary
 */
export const runScoring = async (req: Request, res: Response) => {
  const offer = getOffer();
  const leads = getLeads();

  // Validate prerequisites
  if (!offer) {
    return res.status(400).json({ error: "No offer saved" });
  }
  if (!leads || !leads.length) {
    return res.status(400).json({ error: "No leads uploaded" });
  }

  // Reset previous results
  results = [];

  // Score each lead individually
  for (const lead of leads) {
    try {
      const scored = await scoreLead(lead, offer);
      results.push(scored);
    } catch (e: any) {
      // If scoring fails, push a default low intent result with error info
      results.push({
        ...lead,
        score: 0,
        intent: "Low",
        reasoning: "Scoring error: " + (e.message || ""),
      });
    }
  }

  // Clear leads after scoring to prevent re-processing
  clearLeads();

  res.json({
    message: "Scoring complete",
    count: results.length,
  });
};

/**
 * Returns the scoring results stored in memory.
 * @returns Array of scoring results
 */
export const getResults = () => results;

/**
 * Exports scoring results as a CSV file and triggers download.
 *
 * Validates that results exist
 * Calls CSV export service
 * Sends file as a download response
 * Deletes the file from disk after download
 */
export const downloadResultsCsv = async (req: Request, res: Response) => {
  const results = getResults();

  // Ensure results exist before exporting
  if (!results.length) {
    return res.status(400).json({ error: "No results" });
  }

  // Export results to CSV file
  const csvPath = exportCsv(results);

  // Send CSV file for download and post clean up
  res.download(csvPath, "results.csv", (err) => {
    try {
      fs.unlinkSync(csvPath); // Delete temporary file
    } catch (e) {
      console.error("Error cleaning up CSV file:", e);
    }
  });
};
