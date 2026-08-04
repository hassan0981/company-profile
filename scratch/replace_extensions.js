const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Recursively find all PNG/JPG/JPEG files in public directory to get list of optimized files
function getOptimizedImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getOptimizedImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        // Store both absolute path, relative path from public, and basenames
        fileList.push({
          basename: path.basename(file),
          nameWithoutExt: path.basename(file, ext),
          originalExt: ext,
          relativePath: path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/')
        });
      }
    }
  });
  return fileList;
}

// Recursively find all source files in src directory
function getSourceFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getSourceFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.css'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

function run() {
  console.log('Scanning optimized image list from:', PUBLIC_DIR);
  const images = getOptimizedImages(PUBLIC_DIR);
  console.log(`Found ${images.length} original images. We will replace their references with .webp`);

  console.log('Scanning source files in:', SRC_DIR);
  const sourceFiles = getSourceFiles(SRC_DIR);
  console.log(`Found ${sourceFiles.length} source files.`);

  let totalReplacements = 0;

  sourceFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    images.forEach((img) => {
      // Find patterns like "service_seo.png" or "/service_seo.png" or "team/wajeeha_javed.jpg"
      const targetPattern1 = `${img.nameWithoutExt}${img.originalExt}`;
      const replacement = `${img.nameWithoutExt}.webp`;

      if (content.includes(targetPattern1)) {
        console.log(`Replacing reference "${targetPattern1}" with "${replacement}" in ${path.relative(SRC_DIR, file)}`);
        // Replace all occurrences
        content = content.split(targetPattern1).join(replacement);
        modified = true;
        totalReplacements++;
      }
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
    }
  });

  console.log(`\nExtension replacement completed! Total replacements made: ${totalReplacements}`);
}

run();
