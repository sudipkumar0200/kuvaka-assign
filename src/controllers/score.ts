import { getOffer } from "./offer";
import { getLeads, clearLeads } from "./leads";
import { scoreLead } from "../services/scoring";
import { exportCsv } from "../services/csvExport";
import fs from "fs";
import { Request, Response } from "express";

let results: any[] = [];

export const runScoring = async (req: Request, res: Response) => {
  const offer = getOffer();
  const leads = getLeads();
  if (!offer) return res.status(400).json({ error: "No offer saved" });
  if (!leads || !leads.length) return res.status(400).json({ error: "No leads uploaded" });

  results = [];
  for (const l of leads) {
    try {
      const scored = await scoreLead(l, offer);
      results.push(scored);
    } catch (e:any) {
      results.push({ ...l, score: 0, intent: "Low", reasoning: "Scoring error: " + (e.message || "") });
    }
  }
  clearLeads();
  res.json({ message: "Scoring complete", count: results.length });
};

export const getResults = () => results;

export const downloadResultsCsv = async (req: Request, res: Response) => {
  const results = getResults();
  if (!results.length) return res.status(400).json({ error: "No results" });
  const csvPath = exportCsv(results);
  res.download(csvPath, "results.csv", (err) => {
    try { fs.unlinkSync(csvPath); } catch(e) {}
  });
};
