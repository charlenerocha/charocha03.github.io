const fs = require('fs');
const path = require('path');

// Run from repo root: node scripts/generate-albums-manifest.js
const dirsToCheck = [
  path.join(__dirname, '..', 'assets', 'music', 'albums'),
  path.join(__dirname, '..', 'test', 'assets', 'music', 'albums'),
];

dirsToCheck.forEach((albumsDir) => {
  try {
    if (!fs.existsSync(albumsDir)) {
      console.warn('Skipping non-existent directory:', albumsDir);
      return;
    }

    const files = fs.readdirSync(albumsDir)
      .filter(f => !f.startsWith('.') && f.toLowerCase() !== 'albums.json')
      .filter(f => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
      .sort();

    const outFile = path.join(albumsDir, 'albums.json');
    fs.writeFileSync(outFile, JSON.stringify(files, null, 2));
    console.log('Wrote', outFile, 'with', files.length, 'entries');
  } catch (err) {
    console.error('Error processing', albumsDir, err.message);
  }
});
