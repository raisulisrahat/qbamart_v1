const fs = require('fs');
const path = require('path');

const dirs = [
  'e:/DevOps/Production/qbamart/web/src/components/Admin',
  'e:/DevOps/Production/qbamart/web/src/pages/Admin'
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace button backgrounds
      content = content.replace(/bg-zinc-900 hover:bg-black/g, 'bg-[#C0561F] hover:bg-[#A04518]');
      content = content.replace(/bg-zinc-900 text-white/g, 'bg-[#C0561F] text-white');
      content = content.replace(/bg-black text-white hover:bg-zinc-800/g, 'bg-[#C0561F] text-white hover:bg-[#A04518]');
      content = content.replace(/bg-black hover:bg-zinc-900/g, 'bg-[#C0561F] hover:bg-[#A04518]');
      content = content.replace(/bg-black text-white rounded/g, 'bg-[#C0561F] text-white hover:bg-[#A04518] rounded');
      content = content.replace(/bg-black text-white/g, 'bg-[#C0561F] text-white hover:bg-[#A04518]');
      
      // Replace border and ring
      content = content.replace(/border-zinc-900/g, 'border-[#C0561F]');
      content = content.replace(/ring-zinc-900/g, 'ring-[#C0561F]');
      
      // Chart colors in StaffDashboard
      content = content.replace(/fill="#18181b"/g, 'fill="#C0561F"');
      content = content.replace(/stroke="#18181b"/g, 'stroke="#C0561F"');
      content = content.replace(/stopColor="#18181b"/g, 'stopColor="#C0561F"');
      
      // Active states in Sidebar (StaffDashboard)
      content = content.replace(/bg-zinc-100 text-zinc-900/g, 'bg-[#C0561F]\/10 text-[#C0561F]');
      content = content.replace(/bg-white text-zinc-900 shadow-sm/g, 'bg-[#C0561F] text-white shadow-sm');
      
      // Avatar/Logo backgrounds
      content = content.replace(/bg-zinc-900 flex items-center/g, 'bg-[#C0561F] flex items-center');
      content = content.replace(/bg-zinc-900 rounded/g, 'bg-[#C0561F] rounded');
      content = content.replace(/w-2 h-2 rounded-full bg-zinc-900/g, 'w-2 h-2 rounded-full bg-[#C0561F]');
      content = content.replace(/w-1 h-8 bg-zinc-900/g, 'w-1 h-8 bg-[#C0561F]');
      
      // Generic hover state
      content = content.replace(/hover:bg-zinc-900/g, 'hover:bg-[#A04518]');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

dirs.forEach(processDir);
console.log('Done');
