const fs = require('fs');

const fixAdminFiles = (file) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix duplicate ShieldAlert import
  content = content.replace(/import \{ ShieldAlert, Monitor \} from 'lucide-react';\n/, '');

  // Fix unbalanced tags at the end of the file
  content = content.replace(
    /        <\/EditorCard>[\s\S]*?<\/EditorPage>/m,
    `        </EditorCard>\n        </div>\n      </motion.div>\n    </EditorPage>`
  );

  fs.writeFileSync(file, content, 'utf8');
}

fixAdminFiles('frontend/src/admin/components/editors/admin/ActivityLogsEditor.jsx');
fixAdminFiles('frontend/src/admin/components/editors/admin/ProfileSettingsEditor.jsx');
console.log('Fixed syntax errors');
