const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  const crcVal = crc32(buf.subarray(4, 4 + 4 + len));
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

function createPng(size) {
  const width = size;
  const height = size;
  
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: width, height, bitDepth=8, colorType=6 (RGBA), comp=0, filter=0, interlace=0
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw pixel data: each scanline starts with filter byte 0
  const rawScanlineLen = 1 + width * 4;
  const rawData = Buffer.alloc(height * rawScanlineLen);

  const radius = Math.floor(size * 0.22);
  const cobaltR = 0x36, cobaltG = 0x5c, cobaltB = 0xff; // #365CFF
  const limeR = 0xd8, limeG = 0xf3, limeB = 0x6a; // #D8F36A

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rawScanlineLen;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Check distance from corner for rounded corners
      let inside = true;
      const cornerX = x < radius ? radius - x : (x >= width - radius ? x - (width - radius) : 0);
      const cornerY = y < radius ? radius - y : (y >= height - radius ? y - (height - radius) : 0);
      if (cornerX > 0 && cornerY > 0) {
        if (cornerX * cornerX + cornerY * cornerY > radius * radius) {
          inside = false;
        }
      }

      if (!inside) {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0; // Transparent
      } else {
        // Draw centered dot/monogram
        const centerX = width / 2;
        const centerY = height / 2;
        const distCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

        if (distCenter <= size * 0.18) {
          // Inner signal lime dot
          rawData[pxOffset] = limeR;
          rawData[pxOffset + 1] = limeG;
          rawData[pxOffset + 2] = limeB;
          rawData[pxOffset + 3] = 255;
        } else {
          // Cobalt body
          rawData[pxOffset] = cobaltR;
          rawData[pxOffset + 1] = cobaltG;
          rawData[pxOffset + 2] = cobaltB;
          rawData[pxOffset + 3] = 255;
        }
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', deflated);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const iconsDir = path.join(__dirname, '..', 'extension', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach((size) => {
  const pngBuf = createPng(size);
  const outPath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(outPath, pngBuf);
  console.log(`Generated ${outPath} (${pngBuf.length} bytes)`);
});
