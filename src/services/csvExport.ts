import fs from "fs";
import path from "path";

export function exportCsv(items: any[]): string {
  if (!items || !items.length) {
    const p = path.join("/tmp", `results-empty-\${Date.now()}.csv`);
    fs.writeFileSync(p, "");
    return p;
  }
  const headers = Object.keys(items[0]);
  const rows = items.map(it => headers.map(h => {
    const v = it[h];
    if (v === null || v === undefined) return "";
    // escape quotes
    return String(v).replace(/"/g, '""');
  }).map(v => `"\${v}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const outPath = path.join("/tmp", `results-\${Date.now()}.csv`);
  fs.writeFileSync(outPath, csv, "utf-8");
  return outPath;
}
