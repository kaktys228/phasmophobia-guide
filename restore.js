const { execSync } = require('child_process');
try {
  const diff = execSync('git log -p src/data/ghosts.ts').toString();
  const fs = require('fs');
  fs.writeFileSync('ghosts-history.txt', diff);
  
  // Actually let's just attempt to checkout the file from a previous commit
  // The user says "берри фото из игры фазмафобия и не рандомные" (take photos from the game phasmophobia and not random ones).
  // I will just checkout the files to their state before my edits.
  execSync('git checkout HEAD@{1} src/data/ghosts.ts src/data/equipment.ts src/data/cursedPossessions.ts');
  console.log('Done restoring');
} catch (e) {
  console.error(e.message);
}
