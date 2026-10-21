import sharp from "sharp";
import path from "node:path";

const src = path.resolve("assets/logo.jpg");
const out = path.resolve("assets/logo.png");

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;

  // Near-white background and pale grey shadow fringe -> transparent
  if (max >= 245 && sat < 0.12) {
    data[i + 3] = 0;
    continue;
  }
  if (max >= 228 && sat < 0.1) {
    data[i + 3] = Math.min(data[i + 3], 24);
    continue;
  }
  if (max >= 210 && sat < 0.08) {
    data[i + 3] = Math.min(data[i + 3], 64);
  }
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(out);

console.log(`Wrote ${out} (${info.width}x${info.height})`);
