import { Lead, Offer } from "../types";
import OpenAI from "openai";
import { leadSchema } from "../config/lead";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
console.log("Using OpenAI Key:", OPENAI_KEY ? "Yes" : "No");

/**
 * Assigns points based on role seniority.
 */
function roleScore(role: string): number {
  if (!role) return 0;
  const r = role.toLowerCase();
  if (/(head|vp|vice|director|chief|cxo|founder|co-founder|owner)/i.test(r))
    return 20;
  if (/(manager|lead|principal|senior)/i.test(r)) return 10;
  return 0;
}

/**
 * Assigns points if the lead's industry matches offer use cases.
 */
function industryScore(industry: string, offer: Offer): number {
  if (!industry) return 0;
  const ind = industry.toLowerCase();
  for (const ic of offer.ideal_use_cases) {
    const icl = ic.toLowerCase();
    if (ind === icl) return 20;
    if (ind.includes(icl) || icl.includes(ind)) return 10;
  }
  return 0;
}

/**
 * Gives points if lead data is sufficiently complete.
 */
function completenessScore(lead: Lead): number {
  return lead.name &&
    lead.role &&
    lead.company &&
    lead.industry &&
    lead.location &&
    lead.linkedin_bio
    ? 10
    : 0;
}


/**
 * Calculates a rule-based score for a lead.
 */
export function ruleScore(lead: Lead, offer: Offer): number {
  return (
    roleScore(lead.role) +
    industryScore(lead.industry, offer) +
    completenessScore(lead)
  );
}

async function aiLayer(
  lead: Lead,
  offer: Offer
): Promise<{ intent: string; points: number; reasoning: string }> {
  if (!OPENAI_KEY) {
    return {
      intent: "Medium",
      points: 30,
      reasoning: "OPENAI_API_KEY not provided — fallback medium intent.",
    };
  }

  const client = new OpenAI({ apiKey: OPENAI_KEY });
  const prompt = [
    `You are given a product offer and a prospect. Classify the prospect's buying intent as High, Medium, or Low and explain in 1-2 sentences.`,
    `Offer name: ${offer.name}`,
    `Value props: ${offer.value_props.join("; ")}`,
    `Ideal use cases: ${offer.ideal_use_cases.join("; ")}`,
    `---`,
    `Prospect name: ${lead.name}`,
    `Role: ${lead.role}`,
    `Company: ${lead.company}`,
    `Industry: ${lead.industry}`,
    `Location: ${lead.location}`,
    `LinkedIn bio: ${lead.linkedin_bio}`,
    `---`,
    `Answer format (JSON): {"intent":"High|Medium|Low","explain":"..."}`,
  ].join("\n");

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const text = resp.choices?.[0]?.message?.content || "";

    //Defaults
    let intent = "Low",
      reasoning = text,
      points = 10;
    try {

      //extract JSON from the response
      const j = JSON.parse(
        text.replace(/^[\s\S]*?\{/, "{").replace(/\}\s*[\s\S]*$/, "}")
      );
      intent = j.intent || "Low";
      reasoning = j.explain || text;
    } catch (e) {

      // If parsing fails, fall back to regex based intent detection
      if (/high/i.test(text)) intent = "High";
      else if (/medium/i.test(text)) intent = "Medium";
    }

    // Assigning points based on intent
    if (intent.toLowerCase() === "high") points = 50;
    else if (intent.toLowerCase() === "medium") points = 30;
    else points = 10;

    return { intent, points, reasoning };
  } catch (err: any) {
    return {
      intent: "Medium",
      points: 30,
      reasoning: "AI call failed, fallback to Medium: " + (err.message || ""),
    };
  }
}

/**
 * Validates a lead, applies rule-based scoring, and combines with AI classification.
 * Returns Fully scored result object
 */
export async function scoreLead(leadRaw: Lead, offer: Offer) {
  const parsed = leadSchema.safeParse(leadRaw);
  if (!parsed.success) {
    return {
      ...leadRaw,
      score: 0,
      intent: "Low",
      reasoning: "Validation failed: " + JSON.stringify(parsed.error.format()),
    };
  }
  const lead = parsed.data;
  // Get rule-based score
  const r = ruleScore(lead, offer);

  // Get AI-based classification
  const ai = await aiLayer(lead, offer);

  // Combine for final score and return detailed result
  const final = r + ai.points;


  
  return {
    name: lead.name,
    role: lead.role,
    company: lead.company,
    industry: lead.industry,
    intent: ai.intent,
    score: final,
    reasoning: ai.reasoning,
  };
}
