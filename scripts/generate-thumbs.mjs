import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("assets");
const thumbsDir = path.join(assetsDir, "thumbs");
const maxEdge = 720;
const quality = 80;

fs.mkdirSync(thumbsDir, { recursive: true });

const files = fs.readdirSync(assetsDir).filter((name) => /^extra-\d+\.jpg$/i.test(name));

let totalIn = 0;
let totalOut = 0;

for (const name of files.sort()) {
  const src = path.join(assetsDir, name);
  const dest = path.join(thumbsDir, name);
  const inStat = fs.statSync(src);
  totalIn += inStat.size;

  await sharp(src)
    .rotate()
    .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toFile(dest);

  totalOut += fs.statSync(dest).size;
}

console.log(`Thumbs: ${files.length} files, ${maxEdge}px max edge, q${quality}`);
console.log(`Total ${Math.round(totalIn / 1024)} KB -> ${Math.round(totalOut / 1024)} KB`);
