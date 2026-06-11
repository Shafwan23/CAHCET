import { cmsService } from '../../services/cmsService';

const LOCAL_STORAGE_KEYS = [
  'cahcet_cms_published',
  'cahcet_cms_draft',
  'cahcet_about_institution',
  'cahcet_about_peoples_messages',
  'cahcet_about_anti_ragging',
  'cahcet_about_values',
  'cahcet_about_approval',
  'cahcet_about_governing_policy',
  'cahcet_about_refund_policy',
  'cahcet_about_terms',
  'cahcet_about_privacy',
  'cahcet_homepage_open',
  'cahcet_updates_open',
];

export const runLocalStorageMigration = async () => {
  try {
    const hasRun = localStorage.getItem('cahcet_migration_done');
    if (hasRun) return;

    console.log('Starting LocalStorage to MySQL Migration...');
    const rawPublished = localStorage.getItem('cahcet_cms_published');
    const rawDraft = localStorage.getItem('cahcet_cms_draft');
    
    // We prioritize draft, if exists, over published.
    const rawData = rawDraft || rawPublished;
    if (!rawData) {
      console.log('No legacy LocalStorage CMS data found. Skipping migration.');
      localStorage.setItem('cahcet_migration_done', 'true');
      return;
    }

    const data = JSON.parse(rawData);
    const updates = [];

    // Helper to safely queue updates
    const queueUpdate = (sectionKey, content) => {
      if (content && Object.keys(content).length > 0) {
        updates.push(cmsService.updateSection(sectionKey, { content: typeof content === 'string' ? content : JSON.stringify(content) }));
      }
    };

    // Migrate Homepage Sections
    if (data.hero) queueUpdate('home.hero', data.hero);
    if (data.welcome) queueUpdate('home.welcome', data.welcome);
    if (data.stats) queueUpdate('home.statistics', data.stats);
    if (data.contact) queueUpdate('home.contact', data.contact);
    if (data.navbar) queueUpdate('home.navbar', data.navbar);
    
    // Migrate About Sections
    if (data.about) queueUpdate('about.college', data.about); // Base about page
    if (data.institution || localStorage.getItem('cahcet_about_institution')) {
      const inst = data.institution || JSON.parse(localStorage.getItem('cahcet_about_institution') || '{}');
      queueUpdate('about.institution', inst);
    }
    if (data.peoples_messages || localStorage.getItem('cahcet_about_peoples_messages')) {
      const pm = data.peoples_messages || JSON.parse(localStorage.getItem('cahcet_about_peoples_messages') || '{}');
      queueUpdate('about.peoples_messages', pm);
    }

    // Migrate Admissions Sections
    if (data.admissions) {
      if (data.admissions.steps) queueUpdate('admissions.process', data.admissions.steps);
      const { steps, ...rest } = data.admissions;
      queueUpdate('admissions.registration', rest);
    }

    // Migrate Academics Sections
    if (data.academics) queueUpdate('academics.overview', data.academics);
    if (data.courses) queueUpdate('academics.courses', data.courses);
    
    // Media & Faculty
    if (data.faculty) queueUpdate('faculty.list', data.faculty);
    if (data.gallery) queueUpdate('gallery.images', data.gallery);

    // Wait for all MySQL calls to finish
    await Promise.allSettled(updates);
    console.log(`Successfully migrated ${updates.length} sections to MySQL.`);

    // Clear legacy LocalStorage to prevent conflicts
    LOCAL_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
    localStorage.setItem('cahcet_migration_done', 'true');
    console.log('LocalStorage cleaned up.');

  } catch (error) {
    console.error('Migration failed:', error);
  }
};
