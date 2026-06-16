import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroVideoSection from '../components/sections/HeroVideoSection';
import WelcomeSection from '../components/sections/WelcomeSection';
import DepartmentsSection from '../components/sections/DepartmentsSection';
import GallerySection from '../components/sections/GallerySection';
import PlacementsSection from '../components/sections/PlacementsSection';
import DynamicInfoSection from '../components/sections/DynamicInfoSection';
import VideoShowcaseSection from '../components/sections/VideoShowcaseSection';
import AdmissionsCTA from '../components/sections/AdmissionsCTA';
import ContactSection from '../components/sections/ContactSection';
import { cmsService } from '../services/cmsService';
import SuspenseLoader from '../components/ui/SuspenseLoader';
import apiClient from '../services/authService';

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
        
        // Map sections array into an object keyed by sectionKey
        const sectionsMap = {};
        
        sectionsArray.forEach(sec => {
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
            // Only show published items on the public homepage
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

        setHomeData(sectionsMap);
      } catch (err) {
        console.error('Failed to load homepage CMS data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCMS();
  }, []);

  if (loading) return <SuspenseLoader />;

  // Default empty objects in case CMS fetch fails or is incomplete
  const data = homeData || {};

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        <Helmet>
          <title>C. Abdul Hakeem College of Engineering & Technology</title>
          <meta name="description" content="Official website of CAHCET - A premium engineering college dedicated to excellence in education, research, and innovation." />
          <meta name="keywords" content="CAHCET, engineering college, computer science, placement, admission 2026, research" />
        </Helmet>

        <Navbar />

        <main>
          <HeroVideoSection data={data['home.hero']} />
          <WelcomeSection data={data['home.welcome']} />
          <DynamicInfoSection data={data['home.dynamicinfo']} />
          <DepartmentsSection data={data['home.departments']} />
          <GallerySection data={data['home.gallery']} />
          <PlacementsSection data={data['home.placements']} liveData={data['placements_live']} liveStats={homeData?.statsData || {}} />
          <VideoShowcaseSection data={data['home.videos']} />
          <AdmissionsCTA data={data['home.cta']} />
          <ContactSection data={data['home.contact']} />
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Home;
