import { useMemo } from 'react';
import { validateContent } from './contentValidator';
import { diffJSON } from './diffEngine';

export const useEditorStatus = (sectionsMap, sectionKey, currentForm) => {
  return useMemo(() => {
    const sec = sectionsMap[sectionKey];
    let status = 'DRAFT';
    let lastModified = sec?.updatedAt;
    
    if (sec) {
      if (sec.draftContent && !sec.content) {
        status = 'DRAFT';
      } else {
        const liveData = typeof sec.content === 'string' ? JSON.parse(sec.content || '{}') : (sec.content || {});
        const draftData = typeof sec.draftContent === 'string' ? JSON.parse(sec.draftContent || '{}') : (sec.draftContent || {});
        const diffs = diffJSON(liveData, draftData);
        
        if (diffs.length > 0) {
          status = 'MODIFIED';
        } else {
          status = 'PUBLISHED';
        }
      }
    }

    const validationIssues = validateContent(currentForm, sectionKey);

    return { status, lastModified, validationIssues };
  }, [sectionsMap, sectionKey, currentForm]);
};
