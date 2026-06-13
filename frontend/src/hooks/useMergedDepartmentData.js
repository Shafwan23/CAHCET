import { useMemo, useState, useEffect } from 'react';
import { useDepartmentCMS } from '../admin/utils/useDepartmentCMS';
import { cmsService } from '../services/cmsService';

export function useMergedDepartmentData(deptKey, staticData) {
  const { data: cmsData, isLoading: deptLoading } = useDepartmentCMS(deptKey);
  const [globalFaculty, setGlobalFaculty] = useState(null);
  const [facultyLoading, setFacultyLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await cmsService.getPage('faculty');
        const sections = res.data?.sections || [];
        const facSec = sections.find(s => s.sectionKey === 'faculty.list');
        if (facSec && facSec.content) {
          const allFaculties = JSON.parse(facSec.content);
          // Filter out faculty for this department and ensure they are published
          setGlobalFaculty(allFaculties.filter(f => f.department?.toLowerCase() === deptKey.toLowerCase() && f.status === 'published'));
        }
      } catch(err) {
        // ignore
      } finally {
        setFacultyLoading(false);
      }
    };
    fetchFaculty();
    
    // Auto-refetch on window focus
    window.addEventListener('focus', fetchFaculty);
    return () => window.removeEventListener('focus', fetchFaculty);
  }, [deptKey]);

  return useMemo(() => {
    if (deptLoading || facultyLoading) return null;
    
    const merged = { ...staticData };

    if (globalFaculty && globalFaculty.length > 0) {
      merged.facultyData = globalFaculty;
    }

    if (cmsData) {
      if (cmsData.overview) {
        merged.heroData = {
          ...merged.heroData,
          title: cmsData.overview.title || merged.heroData.title,
          tagline: cmsData.overview.tagline || merged.heroData.tagline,
          backgroundImage: cmsData.overview.bannerImage || merged.heroData.backgroundImage,
        };
        merged.aboutData = {
          ...merged.aboutData,
          about: cmsData.overview.description || merged.aboutData.about,
          vision: cmsData.overview.vision || merged.aboutData.vision,
          mission: cmsData.overview.mission 
            ? cmsData.overview.mission.split('\n').filter(Boolean) 
            : merged.aboutData.mission,
          hod: cmsData.overview.hod || merged.aboutData.hod,
          established: cmsData.overview.established || merged.aboutData.established,
        };
      }
      
      if (cmsData.facilities && cmsData.facilities.length > 0) {
        merged.facilitiesData = cmsData.facilities;
      }
      if (cmsData.faculties && cmsData.faculties.length > 0 && (!globalFaculty || globalFaculty.length === 0)) {
        merged.facultyData = cmsData.faculties;
      }
      if (cmsData.achievements && (Array.isArray(cmsData.achievements) ? cmsData.achievements.length > 0 : Object.keys(cmsData.achievements).length > 0)) {
        merged.achievementsData = cmsData.achievements;
      }
      if (cmsData.gallery && cmsData.gallery.length > 0) {
        merged.galleryData = cmsData.gallery;
      }
      if (cmsData.curriculum && cmsData.curriculum.length > 0) {
        merged.curriculumData = cmsData.curriculum;
      }
      if (cmsData.contact) {
        // Map CMS contact object to an array if needed, or just merge
        // Some static data uses arrays for contactData.
        merged.contactDataCMS = cmsData.contact; 
      }
    }

    return merged;
  }, [cmsData, deptLoading, facultyLoading, globalFaculty, staticData]);
}
