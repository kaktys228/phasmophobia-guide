const { execSync } = require('child_process');
const fs = require('fs');
try {
  let log = execSync('git log -n 10 --oneline').toString();
  console.log(log);
} catch(e) {
  console.log('Error:', e.message);
}
