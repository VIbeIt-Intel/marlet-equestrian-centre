import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("assets");
const backupDir = path.join(assetsDir, "_originals-backup");

function backupOnce(name) {
  fs.mkdirSync(backupDir, { recursive: true });
  const src = path.join(assetsDir, name);
  const dest = path.join(backupDir, name);
  if (!fs.existsSync(dest) && fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

/** Google “original” size when available. */
const googleOriginal = {
  "extra-41.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RVOycF9NHkic1U36wHS2JaWQ0OKEurJVPz5rphlv0eAbOX8Z1-Dzr4jGepdrHkh9lAy8dqBfwXUNsJ8ksMwQ6NIYH_exfQQI4gOzSCRd1lIBRGjzy3s_m8WZb2Ub9jNuNaF18dBv8-hIM=s0",
};

async function downloadGoogle(name, url) {
  backupOnce(name);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${name}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(assetsDir, name);
  await sharp(buf)
    .rotate()
    .jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`google ${name} -> ${meta.width}x${meta.height} (${Math.round(fs.statSync(out).size / 1024)}KB)`);
}

async function upscalePortrait(name, { targetLong = 1680, maxScale = 2.05 } = {}) {
  backupOnce(name);
  const file = path.join(assetsDir, name);
  const meta = await sharp(file).metadata();
  const long = Math.max(meta.width, meta.height);
  if (long >= targetLong) {
    console.log(`skip ${name} already ${meta.width}x${meta.height}`);
    return;
  }
  const scale = Math.min(maxScale, targetLong / long);
  const tmp = file + ".pass2.jpg";
  await sharp(file)
    .rotate()
    .resize(Math.round(meta.width * scale), Math.round(meta.height * scale), {
      kernel: sharp.kernel.lanczos3,
    })
    .median(3)
    .sharpen({ sigma: 0.7, m1: 0.55, m2: 0.4, x1: 2, y2: 10, y3: 18 })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(tmp);
  fs.renameSync(tmp, file);
  const after = await sharp(file).metadata();
  console.log(
    `upscale ${name} ${meta.width}x${meta.height} -> ${after.width}x${after.height} (${Math.round(fs.statSync(file).size / 1024)}KB)`
  );
}

async function clarifyLarge(name) {
  backupOnce(name);
  const file = path.join(assetsDir, name);
  const meta = await sharp(file).metadata();
  const tmp = file + ".pass2.jpg";
  await sharp(file)
    .rotate()
    .median(3)
    .sharpen({ sigma: 0.65, m1: 0.5, m2: 0.35, x1: 2, y2: 8, y3: 16 })
    .jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(tmp);
  fs.renameSync(tmp, file);
  console.log(`clarify ${name} ${meta.width}x${meta.height} (${Math.round(fs.statSync(file).size / 1024)}KB)`);
}

async function main() {
  for (const [name, url] of Object.entries(googleOriginal)) {
    await downloadGoogle(name, url);
  }

  const extras = fs
    .readdirSync(assetsDir)
    .filter((f) => /^extra-\d+\.jpg$/i.test(f))
    .sort();

  for (const name of extras) {
    const file = path.join(assetsDir, name);
    const meta = await sharp(file).metadata();
    const long = Math.max(meta.width, meta.height);
    const bytes = fs.statSync(file).size;
    if (long <= 1280 || (long <= 1500 && bytes < 280000)) {
      await upscalePortrait(name);
    }
  }

  await clarifyLarge("extra-41.jpg");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
