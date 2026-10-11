const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/YouTubeSummary.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Home.tsx',
  'src/pages/History.tsx'
];

for (const file of filesToFix) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace Youtube icon with Video
  content = content.replace(/Youtube/g, 'Video');
  
  // Quick hack for unused imports
  content = content.replace(/Clock,\s*/g, '');
  content = content.replace(/PlayCircle,\s*/g, '');
  content = content.replace(/Bell,\s*/g, '');
  content = content.replace(/Shield,\s*/g, '');
  
  fs.writeFileSync(filePath, content);
}
console.log('Fixed imports');
