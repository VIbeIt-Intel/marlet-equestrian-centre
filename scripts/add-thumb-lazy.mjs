import fs from "node:fs";

let html = fs.readFileSync("index.html", "utf8");

function addLazy(html, className) {
  const re = new RegExp(
    `(<button type="button" class="${className}"[^>]*><img)([^>]*?)(\\/>)`,
    "g"
  );
  return html.replace(re, (match, start, attrs, end) => {
    if (/loading=/.test(attrs)) return match;
    return `${start}${attrs} loading="lazy" decoding="async"${end}`;
  });
}

html = addLazy(html, "card-photo");
html = addLazy(html, "reel-photo");
fs.writeFileSync("index.html", html);
console.log("Added lazy loading to card and reel thumbnails.");
