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

// 1. Force Sync Prisma Schema to Database
run('npx prisma db push --accept-data-loss', 'Prisma DB Push');

// 2. Run Prisma Seed (if any mock data needed)
run('node seed.js', 'Database Seed');

// 3. Start the actual server
console.log('[deploy] Starting Node server...');
require('./index.js');
