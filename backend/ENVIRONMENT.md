# Environment Variables Configuration

This file contains the required environment variables for the ServiceHub backend.

## Database Configuration

- `DATABASE_URL`: Connection string for the PostgreSQL database
  Example: `postgresql://servicehub_user:servicehub_password@localhost:5432/servicehub_db`

## JWT Configuration

- `JWT_SECRET`: Secret key for JWT access tokens
  Example: `your-super-secret-jwt-key-change-in-production`

- `JWT_REFRESH_SECRET`: Secret key for JWT refresh tokens
  Example: `your-super-secret-refresh-jwt-key-change-in-production`

## Application Configuration

- `PORT`: Port for the backend server (default: 3001)
- `NODE_ENV`: Node environment (development/production)

## CORS Configuration

- `FRONTEND_URL`: URL of the frontend application for CORS configuration
  Example: `http://localhost:3000`
