/**
 * useDepartmentCMS.js — Hook for reading/writing department CMS data
 * Used by both admin editors AND public-facing department pages.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { departmentService } from '../services/departmentService';
import { auditService, AUDIT_ACTIONS } from '../services/auditService';

const AUTO_SAVE_DELAY_MS = 30 * 1000;

export function useDepartmentCMS(deptKey) {
  const [data, setData]             = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [isDirty, setIsDirty]       = useState(false);
  const [lastSaved, setLastSaved]   = useState(null);
  const [draftInfo, setDraftInfo]   = useState(null);
  const autoSaveRef                  = useRef(null);

  useEffect(() => {
    if (!deptKey) return;
    
    const fetchDeptData = () => {
      departmentService.getData(deptKey).then(loaded => {
        setData(loaded);
        setIsLoading(false);
      });
    };

    setIsLoading(true);
    fetchDeptData();

    // Auto-refetch on window focus (SWR-like behavior)
    window.addEventListener('focus', fetchDeptData);
    
    return () => {
      window.removeEventListener('focus', fetchDeptData);
    };
  }, [deptKey]);

  const setSection = useCallback((section, newSectionData) => {
    setData(prev => ({ ...prev, [section]: newSectionData }));
    setIsDirty(true);

    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      departmentService.saveDraft(deptKey, section, newSectionData);
      setLastSaved(new Date());
    }, AUTO_SAVE_DELAY_MS);
  }, [deptKey]);

  const saveSection = useCallback(async (section, performedBy = 'unknown', performedByName = '') => {
    if (!data) return;
    const sectionData = data[section];
    const updated = await departmentService.updateSection(deptKey, section, sectionData, performedBy);
    setData(updated);
    setIsDirty(false);
    setLastSaved(new Date());
    departmentService.discardDraft(deptKey, section);

    auditService.log({
      action: AUDIT_ACTIONS.PUBLISH,
      section,
      deptKey,
      performedBy,
      performedByName,
      newValue: sectionData,
    });

    return updated;
  }, [data, deptKey]);

  const saveDraft = useCallback((section) => {
    if (!data) return;
    departmentService.saveDraft(deptKey, section, data[section]);
    setLastSaved(new Date());
    setIsDirty(false);
  }, [data, deptKey]);

  const checkDraft = useCallback((section) => {
    const draft = departmentService.loadDraft(deptKey, section);
    setDraftInfo(draft);
    return draft;
  }, [deptKey]);

  const restoreDraft = useCallback((section) => {
    const draft = departmentService.loadDraft(deptKey, section);
    if (draft) {
      setData(prev => ({ ...prev, [section]: draft.data }));
      setIsDirty(true);
    }
    return draft;
  }, [deptKey]);

  const discardDraft = useCallback(async (section) => {
    departmentService.discardDraft(deptKey, section);
    setDraftInfo(null);
    const fresh = await departmentService.getData(deptKey);
    setData(fresh);
    setIsDirty(false);
  }, [deptKey]);

  const addItem = useCallback(async (section, item, performedBy, performedByName) => {
    const updated = await departmentService.addItem(deptKey, section, item, performedBy);
    setData(updated);
    setLastSaved(new Date());
    auditService.log({
      action: AUDIT_ACTIONS.CREATE,
      section,
      deptKey,
      performedBy,
      performedByName,
      itemTitle: item.name || item.title || '',
      newValue: item,
    });
    return updated;
  }, [deptKey]);

  const updateItem = useCallback(async (section, itemId, updates, performedBy, performedByName) => {
    const old = await departmentService.getSection(deptKey, section);
    const updated = await departmentService.updateItem(deptKey, section, itemId, updates, performedBy);
    setData(updated);
    setLastSaved(new Date());
    auditService.log({
      action: AUDIT_ACTIONS.UPDATE,
      section,
      deptKey,
      performedBy,
      performedByName,
      itemTitle: updates.name || updates.title || itemId,
      oldValue: Array.isArray(old) ? old.find(i => i.id === itemId) : old,
      newValue: updates,
    });
    return updated;
  }, [deptKey]);

  const deleteItem = useCallback(async (section, itemId, performedBy, performedByName, itemTitle = '') => {
    const updated = await departmentService.deleteItem(deptKey, section, itemId, performedBy);
    setData(updated);
    setLastSaved(new Date());
    auditService.log({
      action: AUDIT_ACTIONS.DELETE,
      section,
      deptKey,
      performedBy,
      performedByName,
      itemTitle,
    });
    return updated;
  }, [deptKey]);

  const reorderItems = useCallback(async (section, orderedIds, performedBy) => {
    const updated = await departmentService.reorderItems(deptKey, section, orderedIds, performedBy);
    setData(updated);
    return updated;
  }, [deptKey]);

  const getVersions = useCallback((section) => {
    return departmentService.getVersions(deptKey, section);
  }, [deptKey]);

  const restoreVersion = useCallback(async (section, versionId, performedBy, performedByName) => {
    const updated = await departmentService.restoreVersion(deptKey, section, versionId, performedBy);
    setData(updated);
    setLastSaved(new Date());
    auditService.log({
      action: AUDIT_ACTIONS.RESTORE,
      section,
      deptKey,
      performedBy,
      performedByName,
      itemTitle: `Version ${versionId}`,
    });
    return updated;
  }, [deptKey]);

  useEffect(() => () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); }, []);

  return {
    data,
    isLoading,
    isDirty,
    lastSaved,
    draftInfo,
    setSection,
    saveSection,
    saveDraft,
    checkDraft,
    restoreDraft,
    discardDraft,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    getVersions,
    restoreVersion,
  };
}
