import dotenv from 'dotenv';

dotenv.config();

export const env = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 5432),
  dbUser: process.env.DB_USER || 'examhub',
  dbPassword: process.env.DB_PASSWORD || 'examhub123',
  dbName: process.env.DB_NAME || 'examhub',
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
