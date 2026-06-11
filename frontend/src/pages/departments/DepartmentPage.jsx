import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useMergedDepartmentData } from '../../hooks/useMergedDepartmentData';
import { departmentRegistry } from '../../data/departments';
import SuspenseLoader from '../../components/ui/SuspenseLoader';
import DepartmentLayout from '../../components/departments/DepartmentLayout';

// Sections
import AboutSection from '../../components/departments/sections/AboutSection';
import FacilitiesSection from '../../components/departments/sections/FacilitiesSection';
import FacultySection from '../../components/departments/sections/FacultySection';
import AchievementsSection from '../../components/departments/sections/AchievementsSection';
import GallerySection from '../../components/departments/sections/GallerySection';
import CurriculumSection from '../../components/departments/sections/CurriculumSection';
import ContactSection from '../../components/departments/sections/ContactSection';

const DepartmentPage = () => {
  const { deptKey, section = 'department' } = useParams();
  
  // Verify the department exists
  const staticData = departmentRegistry[deptKey];
  
  const mergedData = useMergedDepartmentData(deptKey, staticData || {});

  if (!staticData) {
    return <Navigate to="/departments" replace />;
  }

  if (!mergedData) return <SuspenseLoader />;

  // Render correct section based on URL param
  const renderSection = () => {
    switch (section) {
      case 'department':
        return <AboutSection data={mergedData.aboutData} />;
      case 'facilities':
        return <FacilitiesSection data={mergedData.facilitiesData} />;
      case 'faculties':
        return <FacultySection data={mergedData.facultyData} />;
      case 'achievements':
        return <AchievementsSection data={mergedData.achievementsData} />;
      case 'events-gallery':
        return <GallerySection data={mergedData.galleryData} />;
      case 'curriculum':
        return <CurriculumSection data={mergedData.curriculumData} />;
      case 'contact-us':
        return <ContactSection data={mergedData.contactData} />;
      default:
        // Fallback to department overview if section is invalid
        return <AboutSection data={mergedData.aboutData} />;
    }
  };

  return (
    <DepartmentLayout data={mergedData} activeSection={section}>
      {renderSection()}
    </DepartmentLayout>
  );
};

export default DepartmentPage;
