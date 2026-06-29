const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/91807/Desktop/Shafwan/cahcet/frontend/src/components/departments/sections';

const files = fs.readdirSync(dir).filter(f => f.endsWith('Section.jsx'));

for (const file of files) {
  if (file === 'FacultySection.jsx') continue; // Already did it manually
  
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Upgrade shadow-luxury to premium deep shadows
  content = content.replace(/shadow-luxury/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]');
  
  // Upgrade hover translations
  content = content.replace(/hover:-translate-y-2/g, 'hover:-translate-y-3 hover:scale-[1.02]');
  
  // Upgrade standard fadeUp to spring based motion
  content = content.replace(/variants=\{departmentAnimations\.fadeUp\}/g, 'variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } } }}');

  // Upgrade rounded-2xl to rounded-3xl
  content = content.replace(/rounded-\[2rem\]/g, 'rounded-[2.5rem]');
  content = content.replace(/rounded-2xl/g, 'rounded-3xl');

  // Enhance gradients
  content = content.replace(/bg-white\/80 backdrop-blur-md/g, 'bg-white/70 backdrop-blur-2xl border-white/80');
  
  // Sticky headers
  content = content.replace(/bg-white\/80 backdrop-blur-xl/g, 'bg-white/70 backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Upgraded frontend:', file);
}
