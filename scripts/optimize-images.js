const sharp = require("sharp");
const { readdir, stat, mkdir } = require("fs/promises");
const { join, dirname, extname, basename } = require("path");
const { existsSync } = require("fs");

const INPUT_DIRS = ["public/media", "public/assets"];
const QUALITY = 85;
const MAX_WIDTH = 1920;

async function processImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const ext = extname(inputPath).toLowerCase();

    if (ext === ".webp") {
      console.log(`⏭️  Skipping ${inputPath} (already WebP)`);
      return;
    }
    if (ext === ".svg") {
      console.log(`⏭️  Skipping ${inputPath} (SVG)`);
      return;
    }

    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    let pipeline = sharp(inputPath);

    // Resize if too large
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    // Convert to WebP
    await pipeline.webp({ quality: QUALITY }).toFile(outputPath);

    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(
      `✅ ${basename(inputPath)} → ${basename(outputPath)} (${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB, -${savings}%)`,
    );
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir, baseDir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath, baseDir);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
          const relativePath = fullPath.replace(baseDir + "/", "");
          const outputPath = join(
            baseDir,
            relativePath.replace(/\.(jpg|jpeg|png|gif)$/i, ".webp"),
          );
          await processImage(fullPath, outputPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

async function main() {
  console.log("Starting image optimization...\n");

  for (const dir of INPUT_DIRS) {
    if (!existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, skipping...`);
      continue;
    }

    console.log(`Processing ${dir}...`);
    await processDirectory(dir, dir);
    console.log();
  }

  console.log("Image optimization complete!");
  console.log("\nNext steps:");
  console.log("   1. Update your code to use .webp extensions");
  console.log("   2. Test the optimized images");
  console.log(
    "   3. Optionally remove original .jpg/.png files after verification",
  );
}

main().catch(console.error);
