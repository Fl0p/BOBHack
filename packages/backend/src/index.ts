import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load .env from project root FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../../.env');
console.log('Loading .env from:', envPath);
config({ path: envPath });
console.log('DB Password loaded:', process.env.BACKEND_DB_PASSWORD ? '✓ Yes' : '✗ No');

// Import after .env is loaded
import express, { Request, Response } from 'express';
import cors from 'cors';
import { initPool, getPool, initializeDatabase } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/hello', async (req: Request, res: Response) => {
  try {
    // Check database connection
    const pool = getPool();
    const result = await pool.query('SELECT COUNT(*) as user_count FROM users');
    const userCount = result.rows[0].user_count;
    
    res.json({ 
      message: `Hello World from Backend! Database is connected and working! Users in DB: ${userCount}`,
      database: {
        connected: true,
        userCount: parseInt(userCount),
        status: 'OK'
      }
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.json({ 
      message: 'Hello World from Backend! Warning: Database connection failed',
      database: {
        connected: false,
        error: 'Database connection failed',
        status: 'ERROR'
      }
    });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    initPool();
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

