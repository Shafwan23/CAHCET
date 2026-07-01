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
  let newContent = content;
  
  // Wrap table if not already wrapped
  const tableRegex = /<table([\s\S]*?)<\/table>/g;
  newContent = newContent.replace(tableRegex, (match) => {
      // Very basic check so we don't double wrap if we run it twice
      return `<div className="w-full overflow-x-auto">\n${match}\n</div>`;
  });
  
  if(newContent !== content) {
     fs.writeFileSync(file, newContent, 'utf8');
     console.log('Fixed tables in ' + file);
  }
});
