import { Framebuffer, triangle } from "./raster.mjs";

const A = [1, 1];
const B = [6, 2];
const C = [3, 7];
const rgb = [255, 0, 0];

const normal = new Framebuffer(10, 10);
const reversed = new Framebuffer(10, 10);

// Urutan vertex normal.
triangle(normal, A, B, C, rgb);

// Urutan vertex dibalik.
triangle(reversed, A, C, B, rgb);

// Bandingkan seluruh piksel kedua framebuffer.
const identical = normal.data.every(
  (value, index) => value === reversed.data[index]
);

// Hitung piksel merah pada hasil normal.
let filledPixels = 0;

for (let i = 0; i < normal.data.length; i += 3) {
  if (
    normal.data[i] === 255 &&
    normal.data[i + 1] === 0 &&
    normal.data[i + 2] === 0
  ) {
    filledPixels++;
  }
}

console.log("Piksel terisi:", filledPixels);
console.log("Hasil kedua gambar identik:", identical);

if (filledPixels > 0 && identical) {
  console.log("PASS: auto-flip winding berhasil.");
} else {
  console.error("FAIL: winding belum konsisten.");
  process.exitCode = 1;
}