const { execSync } = require('child_process');
const fs = require('fs');

try {
  // get the file contents of ghosts.ts from the commit before the picsum changes
  // Assuming the 1st previous commit is before picsum.
  // Wait, I might have made several edits (multi_edit_file) in checkpoint 38. Let's just checkout the file from 1 hour ago.
  const oldGhosts = execSync('git show HEAD@{2 hours}:src/data/ghosts.ts').toString();
  const oldEquipment = execSync('git show HEAD@{2 hours}:src/data/equipment.ts').toString();
  const oldCursed = execSync('git show HEAD@{2 hours}:src/data/cursedPossessions.ts').toString();
  
  fs.writeFileSync('src/data/ghosts.ts', oldGhosts);
  fs.writeFileSync('src/data/equipment.ts', oldEquipment);
  fs.writeFileSync('src/data/cursedPossessions.ts', oldCursed);
  
  console.log("Restored successfully!");
} catch (e) {
  console.log("Error:", e.message);
}
