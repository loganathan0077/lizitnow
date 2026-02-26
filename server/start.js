#!/usr/bin/env node
/**
 * Production start script for Render/Railway deployment.
 * Runs prisma migrate + seed, then starts the server.
 * If migrate or seed fail, the server still starts.
 */
const { execSync } = require('child_process');

function run(cmd, label) {
    try {
        console.log(`[deploy] Running: ${label}...`);
        execSync(cmd, { stdio: 'inherit', cwd: __dirname });
        console.log(`[deploy] ✅ ${label} done.`);
    } catch (err) {
        console.error(`[deploy] ⚠️ ${label} failed, continuing...`, err.message);
    }
}

// Step 1: Run database migrations
run('npx prisma migrate deploy', 'Prisma migrate deploy');

// Step 2: Seed categories (idempotent — uses upsert)
run('node seed.js', 'Database seed');

// Step 3: Start Express server
console.log('[deploy] Starting server...');
require('./index.js');
