import fs from "node:fs";

const sourceFiles = fs.readdirSync("src", { recursive: true })
  .filter((file) => typeof file === "string" && file.endsWith(".ts") && !file.startsWith("i18n/"));
const used = new Set();
for (const file of sourceFiles) {
  const text = fs.readFileSync(`src/${file}`, "utf8");
  for (const match of text.matchAll(/\bt\(\s*["'`]([^"'`]+)["'`]\s*[,)]/g)) used.add(match[1]);
}
const dictionaryText = fs.readFileSync("src/i18n/en.ts", "utf8");
const translated = new Set([...dictionaryText.matchAll(/^\s*["'](.+?)["']:\s*["']/gm)].map((match) => match[1]));
const missing = [...used].filter((key) => !translated.has(key));
const extra = [...translated].filter((key) => !used.has(key));
if (missing.length || extra.length) {
  console.error("i18n mismatch", { missing, extra });
  process.exit(1);
}
console.log(`i18n: ${used.size} keys in sync`);
