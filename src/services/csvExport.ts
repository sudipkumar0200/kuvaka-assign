import fs from "fs";
import path from "path";

export function exportCsv(items: any[]): string {
  if (!items || !items.length) {
    // FIX: Use backticks for the filename
    const p = path.join("/tmp", `results-empty-${Date.now()}.csv`);
    fs.writeFileSync(p, "");
    return p;
  }

  const headers = Object.keys(items[0]);

  const rows = items.map(item =>
    headers.map(header => {
      let value = item[header];
      if (value === null || value === undefined) {
        value = ""; // Default to empty string
      }
      // Escape any double quotes within the value
      const escapedValue = String(value).replace(/"/g, '""');
      
      // FIX: Use backticks to wrap the value in quotes
      return `"${escapedValue}"`;
    }).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  // FIX: Use backticks for the filename
  const outPath = path.join("/tmp", `results-${Date.now()}.csv`);
  
  fs.writeFileSync(outPath, csv, "utf-8");
  return outPath;
}
