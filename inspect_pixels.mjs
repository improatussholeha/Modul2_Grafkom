import fs from "node:fs";

const files = [
  "./out/plan_scratch.ppm",
  "./plan_three.ppm"
];

for (const file of files) {
  const buffer = fs.readFileSync(file);

  // Lewati header PPM: P6, ukuran gambar, dan nilai maksimum warna.
  const header = /^P6\s+\d+\s+\d+\s+255\s/.exec(
    buffer.toString("ascii", 0, 50)
  );

  if (!header) {
    throw new Error(`Header PPM tidak valid: ${file}`);
  }

  const offset = header[0].length;

  function getPixel(x, y) {
    const index = offset + (y * 800 + x) * 3;
    return Array.from(buffer.subarray(index, index + 3));
  }

  console.log(`\nFile: ${file}`);
  console.log("Piksel luar (10,10):", getPixel(10, 10));
  console.log("Piksel dalam (300,300):", getPixel(300, 300));
}