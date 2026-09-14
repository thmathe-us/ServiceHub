#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Database is ready."

# Run prisma generate and push
echo "Running prisma generate and db push..."
npx prisma generate
npx prisma db push --accept-data-loss

# Run seed
echo "Running seed..."
npm run prisma:seed.js

# Start the application
echo "Starting application..."
# List dist directory to debug
echo "Listing dist directory:"
ls -la dist/

# Check if dist/main.js exists, if not try dist/src/main.js
if [ -f "dist/main.js" ]; then
  echo "Starting with dist/main.js"
  exec node dist/main.js
elif [ -f "dist/src/main.js" ]; then
  echo "Starting with dist/src/main.js"
  exec node dist/src/main.js
else
  echo "Error: Neither dist/main.js nor dist/src/main.js found"
  ls -la dist/
  exit 1
fi
