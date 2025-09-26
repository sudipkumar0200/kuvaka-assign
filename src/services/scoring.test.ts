import { describe, it, expect } from "vitest";
import { ruleScore } from "./scoring";
import { Lead, Offer } from "../types";

const baseOffer: Offer = {
  name: "CRM Software",
  value_props: ["automate workflows", "increase sales"],
  ideal_use_cases: ["software", "saas", "crm"],
};

describe("Scoring Logic", () => {
  it("gives 20 for high seniority roles", () => {
    const lead: Lead = {
      name: "Alice",
      role: "VP of Sales",
      company: "Acme Corp",
      industry: "Software",
      location: "NY",
      linkedin_bio: "Experienced VP of Sales",
    };
    expect(ruleScore(lead, baseOffer)).toBe(50); // 20 (role) + 20 (industry) + 10
  });

  it("gives 10 for manager roles", () => {
    const lead: Lead = {
      name: "Bob",
      role: "Sales Manager",
      company: "Beta Inc",
      industry: "CRM",
      location: "SF",
      linkedin_bio: "Manager with CRM expertise",
    };
    expect(ruleScore(lead, baseOffer)).toBe(40); // 10 + 20 + 10
  });

  it("gives 20 when role is missing", () => {
    const lead: Lead = {
      name: "Charlie",
      role: "",
      company: "Gamma Ltd",
      industry: "SaaS",
      location: "LA",
      linkedin_bio: "No role info",
    };
    expect(ruleScore(lead, baseOffer)).toBe(20); // 0 + 20 + 0
  });

  it("gives 20 when industry is missing", () => {
    const lead: Lead = {
      name: "Diana",
      role: "Director",
      company: "Delta",
      industry: "",
      location: "TX",
      linkedin_bio: "Director at Delta",
    };
    expect(ruleScore(lead, baseOffer)).toBe(20); // 20 + 0 + 0
  });

  it("gives 30 for incomplete lead", () => {
    const lead: Lead = {
      name: "Eve",
      role: "Manager",
      company: "Epsilon",
      industry: "SaaS",
      location: "",
      linkedin_bio: "",
    };
    expect(ruleScore(lead, baseOffer)).toBe(30); // 10 + 20 + 0
  });

  it("gives lower score for non-matching industry", () => {
    const lead: Lead = {
      name: "Frank",
      role: "Head of Marketing",
      company: "Zeta",
      industry: "Manufacturing",
      location: "Berlin",
      linkedin_bio: "Marketing head in manufacturing",
    };
    expect(ruleScore(lead, baseOffer)).toBe(30); // 20 + 0 + 10
  });
});
