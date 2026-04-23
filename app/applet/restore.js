import { execSync } from 'child_process';
import fs from 'fs';
try {
  fs.writeFileSync('gitlog.txt', execSync('git log -n 10 --oneline').toString());
} catch(e) {
  console.log(e);
}
