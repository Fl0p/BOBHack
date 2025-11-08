import { Pool } from 'pg';

let pool: Pool;

// Initialize database pool with environment variables
export function initPool() {
  const dbConfig = {
    host: process.env.BACKEND_DB_HOST || 'localhost',
    port: parseInt(process.env.BACKEND_DB_PORT || '5432'),
    user: process.env.BACKEND_DB_USER || 'bobhack',
    password: process.env.BACKEND_DB_PASSWORD,
    database: process.env.BACKEND_DB_NAME || 'bobhack',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  console.log('DB Config:', {
    ...dbConfig,
    password: dbConfig.password ? `***${dbConfig.password.slice(-4)}` : 'undefined',
    passwordType: typeof dbConfig.password
  });

  pool = new Pool(dbConfig);
  return pool;
}

// Initialize database and create tables
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    const client = await getPool().connect();
    console.log('Database connected successfully!');
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Users table is ready!');
    
    client.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Export pool getter for queries
export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initPool() first.');
  }
  return pool;
}

