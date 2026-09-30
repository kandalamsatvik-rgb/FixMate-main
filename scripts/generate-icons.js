import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal PNG generator in pure Node without external native dependencies
function createSolidPNG(width, height, r, g, b, a = 255) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT - Scanlines with filter byte 0
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLength;
    rawData[offset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = offset + 1 + x * 4;
      
      // Draw gradient or icon shape
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.42;

      if (dist < radius) {
        // Center icon area - White / Indigo gradient
        const t = y / height;
        rawData[pixelOffset] = Math.round(79 * (1 - t) + 2 * t);
        rawData[pixelOffset + 1] = Math.round(70 * (1 - t) + 132 * t);
        rawData[pixelOffset + 2] = Math.round(229 * (1 - t) + 199 * t);
        rawData[pixelOffset + 3] = 255;
      } else if (dist < radius + 4) {
        // Golden accent ring
        rawData[pixelOffset] = 249;
        rawData[pixelOffset + 1] = 115;
        rawData[pixelOffset + 2] = 22;
        rawData[pixelOffset + 3] = 255;
      } else {
        // Background indigo/blue
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = a;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(4 + 4 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);

  const crc = crc32(buffer.subarray(4, 8 + length));
  buffer.writeUInt32BE(crc >>> 0, 8 + length);
  return buffer;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ 0xffffffff;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidPNG(192, 192, 79, 70, 229));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidPNG(512, 512, 79, 70, 229));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidPNG(512, 512, 67, 56, 202));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPNG(180, 180, 79, 70, 229));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createSolidPNG(32, 32, 79, 70, 229));

console.log('PWA PNG and favicon assets generated successfully in public/');
