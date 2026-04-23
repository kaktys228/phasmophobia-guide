import fs from 'fs';

const oldCheckpoints = fs.readFileSync('.gemini/antigravity/brain/c8453338-a500-40a7-967a-cfce6a65d038/.system_generated/logs/overview.txt', 'utf8');

console.log(oldCheckpoints.slice(0, 100));
