import fs from "node:fs";

let html = fs.readFileSync("index.html", "utf8");

html = html.replace(/(<img\b[^>]*\bsrc=")assets\/(extra-\d+\.jpg)(")/gi, (match, before, file, after) => {
  if (match.includes("assets/thumbs/")) return match;
  return `${before}assets/thumbs/${file}${after}`;
});

fs.writeFileSync("index.html", html);
console.log("Patched img src paths to assets/thumbs/ for extra-*.jpg");
