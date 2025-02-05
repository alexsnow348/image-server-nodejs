import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Define OS-specific image directory
const isWindows = process.platform === 'win32';
const IMAGE_DIR = isWindows ? 'C:/images' : '/data/biolab_arralyze_picture_data/20240529 K562-NK cells purified_Killing Assay (9b33)/';

app.use(cors()); // Enable CORS for frontend access

// Helper function to scan directories recursively
async function scanDirectory(dir) {
  const files = await fs.promises.readdir(dir);
  let imageFiles = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = await fs.promises.stat(fullPath);

    if (stats.isDirectory()) {
      // If it's a directory, recursively scan it
      imageFiles = imageFiles.concat(await scanDirectory(fullPath));
    } else if (stats.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      // If it's an image file, add to the list and the filename include Merged

      if (fullPath.includes('Merged')) {
        imageFiles.push(fullPath);
      }
  
      
    }
  }

  return imageFiles;
}

const IMAGES = await scanDirectory(IMAGE_DIR);
// API to list images in the directory (including subfolders)
app.get('/api/images', async (req, res) => {
  try {
    // Only return the image filenames (not the full path)
    const imageFiles = IMAGES.map(image => path.relative(IMAGE_DIR, image));
    res.json(imageFiles);
  } catch (err) {
    res.status(500).json({ error: 'Unable to scan directory' });
  }
});

// Serve images from the OS-specific directory
app.use('/images', express.static(IMAGE_DIR));

app.listen(PORT, () => {
  console.log(`Image server running at http://localhost:${PORT}`);
  console.log(`Serving images from: ${IMAGE_DIR}`);
});
