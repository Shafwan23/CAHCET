import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroVideoSection from '../components/sections/HeroVideoSection';
import WelcomeSection from '../components/sections/WelcomeSection';
import { cmsService } from '../services/cmsService';
import SuspenseLoader from '../components/ui/SuspenseLoader';
import apiClient from '../services/authService';
import SectionErrorBoundary from '../components/ui/SectionErrorBoundary';

// Lazy load below-the-fold components
const DynamicInfoSection = lazy(() => import('../components/sections/DynamicInfoSection'));
const DepartmentsSection = lazy(() => import('../components/sections/DepartmentsSection'));
const GallerySection = lazy(() => import('../components/sections/GallerySection'));
const PlacementsSection = lazy(() => import('../components/sections/PlacementsSection'));
const VideoShowcaseSection = lazy(() => import('../components/sections/VideoShowcaseSection'));
const AdmissionsCTA = lazy(() => import('../components/sections/AdmissionsCTA'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));

// 1. Component Registry (Production Safety)
const ComponentRegistry = {
  'home.hero': HeroVideoSection,
  'home.welcome': WelcomeSection,
  'home.dynamicinfo': DynamicInfoSection,
  'home.departments': DepartmentsSection,
  'home.gallery': GallerySection,
  'home.placements': PlacementsSection,
  'home.videos': VideoShowcaseSection,
  'home.cta': AdmissionsCTA,
  'home.contact': ContactSection,
};

// 5. Ordering Rules: Fallback order
const DEFAULT_ORDER = [
  'home.hero', 'home.welcome', 'home.dynamicinfo', 
  'home.departments', 'home.gallery', 'home.placements', 
  'home.videos', 'home.cta', 'home.contact'
];

// 6. Rollback Protection Toggle
const USE_LEGACY_RENDERER = false; 

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeCMS = async () => {
      try {
        const [homeRes, updatesRes, placementsRes, statsRes] = await Promise.all([
          cmsService.getPage('home').catch(() => ({ data: { sections: [] } })),
          cmsService.getPage('updates').catch(() => ({ data: { sections: [] } })),
          cmsService.getPage('placements').catch(() => ({ data: { sections: [] } })),
          apiClient.get('/cms/aggregated-stats').catch(() => ({ data: { data: {} } }))
        ]);

        const sectionsArray = homeRes.data?.sections || [];
        const updatesArray = updatesRes.data?.sections || [];
        const statsData = statsRes.data?.data || {};
        
        const sectionsMap = {};
        const sectionsMeta = {}; // Store visibility and sorting
        
        sectionsArray.forEach(sec => {
          sectionsMeta[sec.sectionKey] = {
            sortOrder: sec.sortOrder || 0,
            isVisible: sec.isVisible !== false, // default true
          };
          try {
            sectionsMap[sec.sectionKey] = JSON.parse(sec.content);
          } catch (e) {
            sectionsMap[sec.sectionKey] = sec.content;
          }
        });

        // Combine Real-time stats with CMS stats
        let cmsStats = sectionsMap['home.statistics'];
        if (!Array.isArray(cmsStats)) {
          cmsStats = [
            { label: 'Successful Placements', value: '95', suffix: '%', icon: '🎯' },
            { label: 'Expert Faculty', value: '250', suffix: '+', icon: '👨‍🏫' },
            { label: 'Companies Visited', value: '150', suffix: '+', icon: '🏢' },
            { label: 'Highest Package', value: '24', suffix: ' LPA', icon: '💰' },
          ];
        }

        // Apply real-time overrides if available
        cmsStats = cmsStats.map(stat => {
          if (stat.label === 'Expert Faculty' && statsData.facultyCount > 0) {
            return { ...stat, value: statsData.facultyCount.toString() };
          }
          if (stat.label === 'Companies Visited' && statsData.uniqueCompanies > 0) {
            return { ...stat, value: statsData.uniqueCompanies.toString() };
          }
          if (stat.label === 'Highest Package' && statsData.highestPackage) {
            const packageStr = String(statsData.highestPackage);
            const numMatch = packageStr.match(/(\d+(\.\d+)?)/);
            if (numMatch && numMatch[1]) {
              return { ...stat, value: numMatch[1], suffix: packageStr.replace(numMatch[1], '') };
            }
          }
          return stat;
        });
        
        sectionsMap['home.statistics'] = cmsStats;

        // Merge updates data into the home.dynamicinfo structure
        const dynamicInfo = sectionsMap['home.dynamicinfo'] || {
          events: { title: 'Latest Events', items: [] },
          placements: { title: 'Placement Updates', items: [] },
          announcements: { title: 'Announcements', items: [] },
          newsletters: { title: 'Newsletters', items: [] }
        };

        updatesArray.forEach(sec => {
          try {
            const parsed = JSON.parse(sec.content);
            const publishedItems = Array.isArray(parsed) ? parsed.filter(item => item.published) : [];
            
            if (sec.sectionKey === 'updates.events') dynamicInfo.events.items = publishedItems;
            if (sec.sectionKey === 'updates.placements') dynamicInfo.placements.items = publishedItems;
            if (sec.sectionKey === 'updates.announcements') dynamicInfo.announcements.items = publishedItems;
            if (sec.sectionKey === 'updates.newsletters') dynamicInfo.newsletters.items = publishedItems;
          } catch (e) {}
        });

        sectionsMap['home.dynamicinfo'] = dynamicInfo;

        const placementsArray = placementsRes.data?.sections || [];
        let recruiters = [];
        let students = [];
        placementsArray.forEach(sec => {
          if (sec.sectionKey === 'placements.recruiters') {
            try { recruiters = JSON.parse(sec.content); } catch (e) {}
          }
          if (sec.sectionKey === 'placements.students') {
            try { students = JSON.parse(sec.content); } catch (e) {}
          }
        });
        sectionsMap['placements_live'] = { recruiters, students };
        sectionsMap['statsData'] = statsData;

        setHomeData({ map: sectionsMap, meta: sectionsMeta });
      } catch (err) {
        console.error('Failed to load homepage CMS data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCMS();
  }, []);

  if (loading) return <SuspenseLoader />;

  const data = homeData?.map || {};
  const meta = homeData?.meta || {};

  // 2. Safe Rendering & Ordering Logic
  const renderDynamicSections = () => {
    const registeredKeys = Object.keys(ComponentRegistry);

    // Build layout map
    const layout = registeredKeys.map(key => {
      const sectionMeta = meta[key] || { isVisible: true, sortOrder: 0 };
      const fallbackIndex = DEFAULT_ORDER.indexOf(key);
      return {
        key,
        Component: ComponentRegistry[key],
        isVisible: sectionMeta.isVisible,
        // Multiply fallback index by 10 to allow CMS reordering between default items if sortOrder is modified
        sortOrder: sectionMeta.sortOrder !== 0 ? sectionMeta.sortOrder : fallbackIndex * 10,
        fallbackIndex
      };
    });

    // Sort sections safely
    layout.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.fallbackIndex - b.fallbackIndex;
    });

    // Render loop
    return layout.map(section => {
      // 4. Visibility Rules
      if (!section.isVisible) return null;
      if (!section.Component) return null;

      const sectionData = data[section.key];
      const extraProps = {};
      
      // Inject required extra props for specific sections
      if (section.key === 'home.placements') {
        extraProps.liveData = data['placements_live'];
        extraProps.liveStats = data['statsData'] || {};
      }

      // 3. Error Isolation via SectionErrorBoundary
      return (
        <SectionErrorBoundary key={section.key} sectionKey={section.key}>
          <Suspense fallback={<SuspenseLoader />}>
            <section.Component data={sectionData} {...extraProps} />
          </Suspense>
        </SectionErrorBoundary>
      );
    });
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>C. Abdul Hakeem College of Engineering & Technology</title>
          <meta name="description" content="Official website of CAHCET - A premium engineering college dedicated to excellence in education, research, and innovation." />
          <meta name="keywords" content="CAHCET, engineering college, computer science, placement, admission 2026, research" />
        </Helmet>

        <Navbar />

        <main className="flex-1">
          {USE_LEGACY_RENDERER ? (
            // LEGACY ROLLBACK RENDERER
            <>
              <HeroVideoSection data={data['home.hero']} />
              <WelcomeSection data={data['home.welcome']} />
              <Suspense fallback={<SuspenseLoader />}>
                <DynamicInfoSection data={data['home.dynamicinfo']} />
                <DepartmentsSection data={data['home.departments']} />
                <GallerySection data={data['home.gallery']} />
                <PlacementsSection data={data['home.placements']} liveData={data['placements_live']} liveStats={data['statsData'] || {}} />
                <VideoShowcaseSection data={data['home.videos']} />
                <AdmissionsCTA data={data['home.cta']} />
                <ContactSection data={data['home.contact']} />
              </Suspense>
            </>
          ) : (
            // NEW DYNAMIC RENDERER
            renderDynamicSections()
          )}
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Home;
