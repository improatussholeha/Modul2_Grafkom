// Demonstrasi sample-centre pada persegi 2x2.
const x0 = 1;
const y0 = 1;
const x1 = 3;
const y1 = 3;

function getPixels(useCentre) {
  const pixels = [];

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const px = useCentre ? x + 0.5 : x;
      const py = useCentre ? y + 0.5 : y;

      const inside = useCentre
        ? px >= x0 && px < x1 &&
          py >= y0 && py < y1
        : px >= x0 && px <= x1 &&
          py >= y0 && py <= y1;

      if (inside) {
        pixels.push(`(${x},${y})`);
      }
    }
  }

  return pixels;
}

const correct = getPixels(true);
const incorrect = getPixels(false);

console.log("Sample-centre:", correct);
console.log("Jumlah piksel yang benar:", correct.length);

console.log("Uji sudut (keliru):", incorrect);
console.log("Jumlah piksel yang keliru:", incorrect.length);