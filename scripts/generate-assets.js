// scripts/generate-assets.js
// Generates icon and splash images for the "Do You Remember?" app.
// Run with: bun run generate-assets
'use strict';

const sharp = require('sharp');
const path = require('path');

const OUT = path.resolve(__dirname, '../assets/images');

const BG = '#FAFAF9';
const TEAL = '#0D9488';
const DARK = '#134E4A'; // darker teal for the ?
const WHITE = '#FFFFFF';

/**
 * Build an SVG with centred "{ ? }" — teal braces, dark ? on bg background.
 * @param {number} size - canvas size
 * @param {string} bg - background fill (or 'transparent')
 * @param {string} braceColor - color for { and }
 * @param {string} qColor - color for ?
 * @param {number} fontSize
 */
function makeSvg(size, bg, braceColor, qColor, fontSize) {
  const bgRect =
    bg === 'transparent'
      ? ''
      : `<rect width="${size}" height="${size}" fill="${bg}"/>`;

  const cx = size / 2;
  const cy = size / 2;
  // Spread braces out from centre by ~36% of font size
  const spread = fontSize * 0.72;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bgRect}
  <text
    x="${cx - spread}"
    y="${cy}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="${braceColor}"
    text-anchor="middle"
    dominant-baseline="central"
  >{</text>
  <text
    x="${cx}"
    y="${cy}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="${qColor}"
    text-anchor="middle"
    dominant-baseline="central"
  >?</text>
  <text
    x="${cx + spread}"
    y="${cy}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="${braceColor}"
    text-anchor="middle"
    dominant-baseline="central"
  >}</text>
</svg>`;
}

const assets = [
  { file: 'icon.png',                    svg: makeSvg(1024, BG,            TEAL,  DARK,  280), size: 1024 },
  { file: 'splash-icon.png',             svg: makeSvg(512,  BG,            TEAL,  DARK,  140), size: 512  },
  { file: 'android-icon-foreground.png', svg: makeSvg(1024, 'transparent', TEAL,  DARK,  280), size: 1024 },
  { file: 'android-icon-background.png', svg: makeSvg(1024, BG,            BG,    BG,    1),   size: 1024 },
  { file: 'android-icon-monochrome.png', svg: makeSvg(1024, 'transparent', WHITE, WHITE, 280), size: 1024 },
  { file: 'favicon.png',                 svg: makeSvg(64,   BG,            TEAL,  DARK,  18),  size: 64   },
];

async function run() {
  for (const asset of assets) {
    const outPath = path.join(OUT, asset.file);
    await sharp(Buffer.from(asset.svg))
      .resize(asset.size, asset.size)
      .png()
      .toFile(outPath);
    console.log(`✓ ${asset.file}`);
  }
  console.log('\nAll assets generated successfully.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
