const fs = require("fs");
const path = require("path");

// Run from repo root (project folder). This script will scan test/assets/camera/pics
// and write manifest.json listing the filenames (not full paths).
(async function main() {
  try {
    const picsDir = path.join(
      process.cwd(),
      "test",
      "assets",
      "camera",
      "pics",
    );
    if (!fs.existsSync(picsDir)) {
      console.error("Directory not found:", picsDir);
      process.exitCode = 2;
      return;
    }

    const files = fs.readdirSync(picsDir);
    const exts = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".avif",
      ".bmp",
      ".svg",
    ];
    const images = files.filter((f) =>
      exts.includes(path.extname(f).toLowerCase()),
    );

    const outPath = path.join(picsDir, "manifest.json");
    fs.writeFileSync(outPath, JSON.stringify(images, null, 2), "utf8");
    console.log("Wrote manifest with", images.length, "items to", outPath);
  } catch (err) {
    console.error("Failed to generate manifest:", err);
    process.exitCode = 1;
  }
})();
