import sharp from "sharp";
import path from "node:path";

const size = 1200;
const padRatio = 0.1;
const inner = Math.round(size * (1 - padRatio * 2));

const logoPath = path.resolve("assets/logo.png");
const outPath = path.resolve("assets/og-share.jpg");

const logoBuf = await sharp(logoPath)
  .resize(inner, inner, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .toBuffer();

await sharp({
  create: {
    width: size,
    height: size,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([{ input: logoBuf, gravity: "center" }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(outPath);

console.log(`Wrote ${outPath} (${size}x${size}, logo contained with padding)`);
