const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Recursively find all PNG/JPG/JPEG files
function getImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext) && !file.endsWith('.webp')) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

async function optimizeFavicon() {
  const whiteOutlinePath = path.join(PUBLIC_DIR, 'white_outline.png');
  const faviconPath = path.join(PUBLIC_DIR, 'favicon.ico');

  if (fs.existsSync(whiteOutlinePath)) {
    console.log('Optimizing favicon.ico from white_outline.png...');
    try {
      const oldSize = fs.existsSync(faviconPath) ? fs.statSync(faviconPath).size : 0;
      // Convert to 32x32 PNG
      await sharp(whiteOutlinePath)
        .resize(32, 32)
        .png()
        .toFile(faviconPath + '.tmp');

      if (fs.existsSync(faviconPath)) {
        fs.unlinkSync(faviconPath);
      }
      fs.renameSync(faviconPath + '.tmp', faviconPath);

      const newSize = fs.statSync(faviconPath).size;
      console.log(`Favicon optimized successfully! ${formatBytes(oldSize)} -> ${formatBytes(newSize)}`);
    } catch (err) {
      console.error('Error optimizing favicon:', err);
    }
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function run() {
  console.log('Scanning for images in:', PUBLIC_DIR);
  const images = getImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to optimize.`);

  let totalOldSize = 0;
  let totalNewSize = 0;

  for (const imgPath of images) {
    const relativePath = path.relative(PUBLIC_DIR, imgPath);
    const filename = path.basename(imgPath).toLowerCase();
    const oldSize = fs.statSync(imgPath).size;
    totalOldSize += oldSize;

    // Determine target width
    let targetWidth = 1200; // default for large illustrations
    if (filename.includes('logo') || filename.includes('icon') || filename.includes('brand') || filename.includes('forces_school') || filename.includes('white_outline')) {
      targetWidth = 300; // logos and icons do not need to be wider than 300px
    } else if (filename.includes('portrait') || filename.includes('avatar') || filename.includes('team') || filename.includes('unlock_potential')) {
      targetWidth = 600; // portraits and team members
    }

    const outputExt = '.webp';
    const outputFilename = path.basename(imgPath, path.extname(imgPath)) + outputExt;
    const outputPath = path.join(path.dirname(imgPath), outputFilename);

    try {
      console.log(`Optimizing ${relativePath} (Width: ${targetWidth})...`);
      
      const pipeline = sharp(imgPath)
        .resize({ width: targetWidth, withoutEnlargement: true });

      // Output webp
      await pipeline.webp({ quality: 80 }).toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      totalNewSize += newSize;
      
      console.log(`  -> Saved ${path.basename(outputPath)} (${formatBytes(oldSize)} -> ${formatBytes(newSize)})`);
    } catch (err) {
      console.error(`  -> Failed to optimize ${relativePath}:`, err.message);
    }
  }

  // Optimize favicon.ico
  await optimizeFavicon();

  console.log('\n--- Optimization Summary ---');
  console.log(`Total Original Size: ${formatBytes(totalOldSize)}`);
  console.log(`Total Optimized Size: ${formatBytes(totalNewSize)}`);
  console.log(`Net savings: ${formatBytes(totalOldSize - totalNewSize)} (${((totalOldSize - totalNewSize) / totalOldSize * 100).toFixed(2)}% saved)`);
}

run();
