/**
 * This script generates PNG icons from the SVG icon
 * It requires the 'sharp' package to be installed:
 * npm install sharp --save-dev
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICON_SIZES = [16, 48, 128];
const SVG_PATH = path.join(__dirname, '../extension/icons/icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../extension/icons');

async function generateIcons() {
  console.log('Generating extension icons...');
  
  // Check if SVG file exists
  if (!fs.existsSync(SVG_PATH)) {
    console.error(`SVG file not found: ${SVG_PATH}`);
    process.exit(1);
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Read SVG file
  const svgBuffer = fs.readFileSync(SVG_PATH);
  
  // Generate icons for each size
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${outputPath}`);
    } catch (error) {
      console.error(`Error generating icon${size}.png:`, error);
    }
  }
  
  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
