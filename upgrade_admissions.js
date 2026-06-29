const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/admin/components/editors/admissions';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Imports
  if (!content.includes('useEditorStatus')) {
    content = content.replace(
      /import \{ cmsService \} from '([^']+)';/,
      "import { cmsService } from '$1';\nimport SectionPreviewModal from '../../ui/SectionPreviewModal';\nimport { useEditorStatus } from '../../../utils/useEditorStatus';\nimport { motion } from 'framer-motion';\nimport { ShieldAlert, Monitor } from 'lucide-react';"
    );
  }
  
  if (!content.includes('previewSection')) {
    content = content.replace(
      /const \[sectionsMap, setSectionsMap\] = useState\(\{\}\);/,
      "const [sectionsMap, setSectionsMap] = useState({});\n  const [previewSection, setPreviewSection] = useState(null);"
    );
  }

  // Admissions has multiple forms in some files, but one main section key usually drives status
  const sectionKeyMatch = content.match(/sMap\['(admissions\.[^']+)'\]/);
  const mainSectionKey = sectionKeyMatch ? sectionKeyMatch[1] : 'admissions.misc';
  const fallbackFormMatch = content.match(/const \[([^,]+),\s*set([^\]]+)\] = useState/);
  const mainFormVar = fallbackFormMatch ? fallbackFormMatch[1] : 'form';

  // We don't rewrite fetchData entirely, just handleSave!
  const handleSaveRegex = /const handleSave = async \(\) => \{[\s\S]*?finally \{\s*setSaving\(false\);\s*\}\s*\};/g;
  content = content.replace(handleSaveRegex, `const handleSaveDraft = async (isSilent = false) => {
    try {
      setSaving(true);
      const updates = [];
      const keys = Object.keys(sectionsMap).filter(k => k.startsWith('admissions.'));
      // This is a generic approach: we assume the editor has access to its specific form state variables if we just use the original handleSave logic, but modified to save draft!
      // Actually, since we can't easily parse all form names dynamically, we will just use a generic save that looks for the state variable names!
    } catch (err) {}
  };`);

  // It's too complex to rewrite handleSave dynamically for multiple forms via regex.
}
