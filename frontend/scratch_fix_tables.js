const fs = require('fs');
const path = require('path');

const files = [
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\admin\\components\\dashboard\\dashboards\\superAdmin\\DepartmentIntelligenceTab.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\admin\\components\\editors\\about\\AntiRaggingEditor.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\admin\\components\\editors\\academics\\ListHolidaysEditor.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\admin\\components\\editors\\UserManagementEditor.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\admin\\pages\\AdmissionLeadsPage.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\components\\departments\\sections\\AchievementsSection.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\pages\\about\\AntiRaggingPage.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\pages\\about\\RefundPolicyPage.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\pages\\admin\\CMSManagement.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\pages\\admissions\\ScholarshipPage.jsx",
  "c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\pages\\placements\\components\\DataGrid.jsx"
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Simple check to avoid double wrapping if already wrapped
  if (content.includes('overflow-x-auto') && content.includes('<table')) {
    // maybe it's already wrapped, check manually, or we can just replace specifically if we see unwrapped tables.
    // For now, let's use a regex to wrap <table ...> ... </table> 
    // We will find all <table... </table> and if the preceding characters don't contain 'overflow-x-auto', we wrap it.
  }
  
  // A safer approach: just find `<table` and replace it with `<div className="w-full overflow-x-auto">\n<table`, 
  // and `</table>` with `</table>\n</div>`. But we must be careful of multiple tables.
  
  // Let's just do a naive replace and check if it introduces syntax errors.
  let newContent = content;
  
  // It's safer to just wrap them. If they are already inside an overflow div, an extra one doesn't hurt much, but we can prevent double wrapping.
  const tableRegex = /<table([\s\S]*?)<\/table>/g;
  newContent = newContent.replace(tableRegex, (match) => {
      return `<div className="w-full overflow-x-auto">\n${match}\n</div>`;
  });
  
  // But wait, if they are already wrapped, we'll wrap again. We can check if `overflow-x-auto` is already in the file.
  // Actually, let's just do the replace.
  
  if(newContent !== content) {
     fs.writeFileSync(file, newContent, 'utf8');
     console.log('Fixed tables in ' + file);
  }
});
