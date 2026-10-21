import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("assets");
const backupDir = path.join(assetsDir, "_originals-backup");

/** Full-resolution Google Business downloads (replace earlier 1600px pulls). */
const googleMax = {
  "extra-39.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RY6Rlwliwad_4vxC98mPHLZ7B1tjI8iKpHnfxLG86LdBDgwqIZS7L73_7TYzhfwsxMN_srInEtEWwTZMjCOnvFxgLKMB7wyFkmbTZ6RIN2sIxVyC4vlThoQziKzPOtlq18XtsS=w3024-h4032-k-no",
  "extra-40.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TmF-ZfJpZv62RpBtlbZC-VAw_5HfQa37K0KQDzTTOUt4bNnX4BiWCbbMTDom9xKU9rJiONh8yUlxRTKXq1n0wGN9j9pGUHIGzu132i2mPG-Mmpc7muk6mnxvkgD2719ZjJF64=w1280-h853-k-no",
  "extra-41.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RVOycF9NHkic1U36wHS2JaWQ0OKEurJVPz5rphlv0eAbOX8Z1-Dzr4jGepdrHkh9lAy8dqBfwXUNsJ8ksMwQ6NIYH_exfQQI4gOzSCRd1lIBRGjzy3s_m8WZb2Ub9jNuNaF18dBv8-hIM=w3000-h4000-k-no",
  "extra-42.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RVtCkZEn6IbIbFVN6cHQJPSlhglqt8t0tsg7zGR8WUHiT-amH6gSbYjaEeDgHZIRRq5gSoxWMbG5DzVNVcp-rjy24i3sFEhIkS5agaJuGznG0sJnjXq6bOEW3MOxKeOh_i0ZQ=w864-h1152-k-no",
  "extra-43.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9R0mfObduwefAgxKWnv3dvhbp2SlY_iB-GXb67-nhqBU9jzmeQx38yIN3UyYmpjoObyF8VGNmL8bPOqQPfunUqZp5L2_HOsUcol3rjJSmHJgIiSvN2pohAb4KMH_YtPEaQS-U8eog=w864-h1152-k-no",
  "extra-44.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9R9iFn8ZPP_bpl1AQP7xdJh7qI_OU-RwO0Yv6E-UuGk2ax9qN9XX8sEOboQeSng8BYJoJMcjQrICHgJ_mv7eTgt0oWmPyR3dQFt-m9boFIYQViC8TEpVPxqc4WUWojGTiXG4gP1yg=w910-h683-k-no",
  "extra-45.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SUCsTXGHPPkuXZhcj2OWaXzmZ6VRRHR6KKJYdhBMKQSyN3QfnWc6aSYzi03cmyxEBZKd7aqjXAmwrGHu8xXBMsiokTvI8GeIjuiXavIpuo0QSxENedsqsfOpg480SESMiaUdgPBl8PORU=w3000-h4000-k-no",
  "extra-46.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QlO_gXM4JYZKUdaGk-SEs5vvjD_n87idYSy37mQ2hdClFhcd_t0Cc0nEuNPHvuGP_1ccebVvwjhW-hNq7mA3nX2dz3UO8-Po7GAgpygp11ghFBHW34Sj9z4HU0OTolmzK-ATaC=w3024-h4032-k-no",
  "extra-47.jpg":
    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S0QJ86GW9JHqeH8oXmEYiO4Fia5aqjyxa-eyHvlVTXHaGi7-rq_4zipU6G5q1gL3bMrn7vGADge-8x--U7D3mONP0GzvF-g48MUMzQ73ienk7vpCpIuCixk7k-5z8YFm5-f2w=w3024-h4032-k-no",
};

/** Client uploads that are small or over-compressed — gentle upscale + sharpen only. */
const clientEnhance = [
  "extra-2.jpg",
  "extra-6.jpg",
  "extra-9.jpg",
  "extra-10.jpg",
  "extra-12.jpg",
  "extra-14.jpg",
  "extra-16.jpg",
  "extra-17.jpg",
  "extra-22.jpg",
  "extra-25.jpg",
];

function backupOnce(name) {
  fs.mkdirSync(backupDir, { recursive: true });
  const src = path.join(assetsDir, name);
  const dest = path.join(backupDir, name);
  if (!fs.existsSync(dest) && fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

async function downloadGoogle(name, url) {
  backupOnce(name);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${name}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(assetsDir, name);
  await sharp(buf)
    .rotate()
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`google ${name} -> ${meta.width}x${meta.height}`);
}

async function gentleEnhance(name, { minLong = 1400, maxScale = 1.85 } = {}) {
  backupOnce(name);
  const file = path.join(assetsDir, name);
  const meta = await sharp(file).metadata();
  const long = Math.max(meta.width, meta.height);
  let pipeline = sharp(file).rotate();

  if (long < minLong) {
    const scale = Math.min(maxScale, minLong / long);
    pipeline = pipeline.resize(Math.round(meta.width * scale), Math.round(meta.height * scale), {
      kernel: sharp.kernel.lanczos3,
    });
  }

  pipeline = pipeline.sharpen({ sigma: 0.55, m1: 0.5, m2: 0.35, x1: 2, y2: 8, y3: 16 });

  const tmp = file + ".enhanced.jpg";
  await pipeline.jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(tmp);
  fs.renameSync(tmp, file);
  const after = await sharp(file).metadata();
  console.log(`enhance ${name} ${meta.width}x${meta.height} -> ${after.width}x${after.height}`);
}

async function main() {
  for (const [name, url] of Object.entries(googleMax)) {
    await downloadGoogle(name, url);
  }
  for (const name of clientEnhance) {
    if (!fs.existsSync(path.join(assetsDir, name))) continue;
    await gentleEnhance(name);
  }
  for (const name of ["extra-40.jpg", "extra-42.jpg", "extra-43.jpg", "extra-44.jpg"]) {
    await gentleEnhance(name, { minLong: 1280, maxScale: 1.5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
