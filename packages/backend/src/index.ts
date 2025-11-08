import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

// Load .env from project root FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../../.env');
console.log('Loading .env from:', envPath);
config({ path: envPath });
console.log('DB Password loaded:', process.env.BACKEND_DB_PASSWORD ? '✓ Yes' : '✗ No');
console.log('Session Secret loaded:', process.env.SESSION_SECRET ? '✓ Yes' : '✗ No');

// Import after .env is loaded
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { OAuth2Client } from 'google-auth-library';
import { initPool, getPool, initializeDatabase } from './db.js';

// Load Google OAuth credentials
const clientSecretPath = resolve(__dirname, '../../../client_secret.json');
const clientSecret = JSON.parse(readFileSync(clientSecretPath, 'utf-8'));
const googleClient = new OAuth2Client(clientSecret.web.client_id);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://bob.aignite.pl'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Check for SESSION_SECRET
if (!process.env.SESSION_SECRET) {
  console.warn('⚠️  WARNING: SESSION_SECRET not set in .env file!');
  console.warn('⚠️  Using default secret - NOT SECURE for production!');
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-insecure-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Google OAuth authentication endpoint
app.post('/api/auth/google', async (req: Request, res: Response) => {
  try {
    console.log('📥 Received Google auth request');
    const { credential } = req.body;
    
    if (!credential) {
      console.error('❌ No credential provided');
      return res.status(400).json({ error: 'No credential provided' });
    }

    console.log('🔐 Verifying Google token...');
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientSecret.web.client_id,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      console.error('❌ Invalid token payload');
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { sub: googleId, email, name, picture } = payload;
    console.log('✅ Token verified for:', email);

    // Check if user exists in database
    const pool = getPool();
    let userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      console.log('👤 Creating new user:', email);
      const insertResult = await pool.query(
        'INSERT INTO users (email, name, google_id, picture) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, name, googleId, picture]
      );
      user = insertResult.rows[0];
      console.log('✅ New user created:', email);
    } else {
      // Update existing user
      user = userResult.rows[0];
      await pool.query(
        'UPDATE users SET name = $1, google_id = $2, picture = $3, last_login = NOW() WHERE id = $4',
        [name, googleId, picture, user.id]
      );
      console.log('✅ User logged in:', email);
    }

    // Store user in session
    (req.session as any).user = {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture
    };

    console.log('✅ Session created for user:', user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('❌ Google authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current user endpoint
app.get('/api/auth/user', (req: Request, res: Response) => {
  const user = (req.session as any).user;
  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

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
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📝 OAuth endpoint: http://localhost:${PORT}/api/auth/google`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
