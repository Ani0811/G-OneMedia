import fs from 'fs';

function getJpegSize(filePath) {
  const buf = fs.readFileSync(filePath);
  let i = 2; // skip SOI
  while (i < buf.length) {
    if (buf[i] !== 0xFF) {
      // invalid marker
      return null;
    }
    const marker = buf[i + 1];
    if (marker === 0xD9) { // EOI
      break;
    }
    const length = buf.readUInt16BE(i + 2);
    // SOF0 (0xC0) to SOF15 (0xCF) except SOF4 (0xC4), SOF8 (0xC8), SOF12 (0xCC)
    if ((marker >= 0xC0 && marker <= 0xCF) && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
      const height = buf.readUInt16BE(i + 5);
      const width = buf.readUInt16BE(i + 7);
      return { width, height };
    }
    i += 2 + length;
  }
  return null;
}

console.log('before:', getJpegSize('public/before_static_site.png'));
console.log('after:', getJpegSize('public/after_dynamic_site.png'));
