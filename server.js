import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static images if requested (optional, since Vite public folder does it, but good practice)
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Endpoint to serve products list from JSON file
app.get('/api/products', (req, res) => {
  try {
    const productsPath = path.join(__dirname, 'public', 'data', 'products.json');
    if (!fs.existsSync(productsPath)) {
      return res.status(404).json({ error: 'products.json file not found' });
    }
    const rawData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(rawData);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error while fetching products' });
  }
});

// Root message
app.get('/', (req, res) => {
  res.send('Wyze Security System Bundle Builder Backend API is running. Query /api/products for data.');
});

app.listen(PORT, () => {
  console.log(`[Backend API] Server is running on http://localhost:${PORT}`);
});
