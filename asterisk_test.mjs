import { mkdirSync } from "node:fs";
import { Framebuffer, lineBresenham } from "./raster.mjs";

const W = 100;
const H = 100;
const CX = 50;
const CY = 50;
const RADIUS = 24;

const fb = new Framebuffer(W, H, [18, 18, 22]);
const rgb = [253, 231, 37];

const results = [];

for (let angle = 0; angle < 360; angle += 15) {
  const rad = (angle * Math.PI) / 180;

  const x1 = Math.round(CX + RADIUS * Math.cos(rad));
  const y1 = Math.round(CY + RADIUS * Math.sin(rad));

  // Gambar satu jari-jari menggunakan Bresenham.
  const pixels = lineBresenham(
    CX, CY, x1, y1, fb, rgb
  );

  const dx = x1 - CX;
  const dy = y1 - CY;
  const measuredRadius = Math.hypot(dx, dy);

  // Jumlah piksel yang diharapkan untuk algoritma Bresenham.
  const expectedCount =
    Math.max(Math.abs(dx), Math.abs(dy)) + 1;

  // Periksa jarak piksel dari garis geometris ideal.
  let maxDeviation = 0;
  const lengthSquared = dx * dx + dy * dy;

  for (const [px, py] of pixels) {
    const t = Math.max(
      0,
      Math.min(
        1,
        ((px - CX) * dx + (py - CY) * dy) /
          lengthSquared
      )
    );

    const idealX = CX + t * dx;
    const idealY = CY + t * dy;

    const deviation = Math.hypot(
      px - idealX,
      py - idealY
    );

    maxDeviation = Math.max(maxDeviation, deviation);
  }

  const ok =
    Math.abs(measuredRadius - RADIUS) <= 1 &&
    pixels.length === expectedCount &&
    maxDeviation <= 1;

  results.push({
    angle,
    radius: measuredRadius,
    count: pixels.length,
    maxDeviation,
    ok
  });

  console.log(
    `${String(angle).padStart(3)}° | ` +
    `radius=${measuredRadius.toFixed(2)} | ` +
    `pixel=${pixels.length} | ` +
    `deviasi=${maxDeviation.toFixed(2)} | ` +
    `${ok ? "PASS" : "FAIL"}`
  );
}

mkdirSync("out", { recursive: true });
fb.writePPM("out/asterisk24.ppm");

const passed = results.filter((r) => r.ok).length;
const minRadius = Math.min(...results.map((r) => r.radius));
const maxRadius = Math.max(...results.map((r) => r.radius));

console.log("\n=== RINGKASAN ===");
console.log(`Jumlah jari-jari: ${results.length}`);
console.log(`Lulus: ${passed}`);
console.log(`Gagal: ${results.length - passed}`);
console.log(
  `Rentang radius: ${minRadius.toFixed(2)} - ${maxRadius.toFixed(2)} piksel`
);
console.log("Gambar: out/asterisk24.ppm");

if (passed !== 24) {
  console.error("FAIL: periksa hasil rasterisasi garis.");
  process.exitCode = 1;
} else {
  console.log("PASS: seluruh 24 jari-jari memenuhi pemeriksaan.");
}