/**
 * Validates CMS content drafts before publishing.
 * Returns an array of warnings or errors.
 */
export const validateContent = (draftContent, sectionKey) => {
  const issues = [];
  const parsed = typeof draftContent === 'string' ? safeParse(draftContent) : (draftContent || {});

  // General link validation (searches stringified payload for URLs)
  const rawString = JSON.stringify(parsed);
  const urls = rawString.match(/(https?:\/\/[^\s"']+)/g) || [];
  
  // Actually, checking broken links synchronously is hard without fetching.
  // We will just do format validation.
  urls.forEach(url => {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      issues.push({ type: 'warning', message: `Found local dev link: ${url}` });
    }
  });

  // Section specific validation
  if (sectionKey === 'home.hero') {
    if (!parsed.title) issues.push({ type: 'error', message: 'Hero Title is required.' });
    if (!parsed.ctaLink) issues.push({ type: 'error', message: 'Hero CTA Link is missing.' });
  }

  if (sectionKey === 'home.welcome') {
    if (!parsed.principalName) issues.push({ type: 'error', message: 'Principal Name is missing.' });
    if (!parsed.description || parsed.description.length < 50) {
      issues.push({ type: 'warning', message: 'Welcome description is very short. Consider expanding it.' });
    }
    if (!parsed.principalImage) {
      issues.push({ type: 'error', message: 'Principal Image is required.' });
    }
  }

  if (sectionKey === 'home.academic') {
    if (!parsed.title) issues.push({ type: 'error', message: 'Department section title is required.' });
    if (!parsed.subtitle) issues.push({ type: 'error', message: 'Department section subtitle is required.' });
    if (!parsed.highlightedDepts || parsed.highlightedDepts.length === 0) {
      issues.push({ type: 'error', message: 'You must select at least one department to highlight.' });
    }
  }

  if (sectionKey === 'home.gallery') {
    if (!parsed.images || parsed.images.length === 0) {
      issues.push({ type: 'error', message: 'Gallery must contain at least one image.' });
    } else {
      parsed.images.forEach((img, i) => {
        if (!img.url) issues.push({ type: 'error', message: `Gallery image ${i + 1} is missing a URL.` });
        if (!img.caption) issues.push({ type: 'warning', message: `Gallery image ${i + 1} is missing alt text/caption.` });
      });
    }
  }

  if (sectionKey === 'home.contact') {
    if (!parsed.phone) issues.push({ type: 'error', message: 'Contact phone number is required.' });
    if (!parsed.email || !parsed.email.includes('@')) issues.push({ type: 'error', message: 'A valid contact email is required.' });
    if (!parsed.mapUrl) issues.push({ type: 'warning', message: 'Google Maps embed URL is missing.' });
  }

  if (sectionKey === 'home.cta') {
    if (!parsed.title) issues.push({ type: 'error', message: 'CTA Title is required.' });
    if (!parsed.buttonText) issues.push({ type: 'error', message: 'CTA Button text is required.' });
    if (!parsed.buttonLink) issues.push({ type: 'error', message: 'CTA Button link URL is required.' });
  }

  // Find all keys that might be images
  Object.keys(parsed).forEach(key => {
    if (key.toLowerCase().includes('image') || key.toLowerCase().includes('icon')) {
      const val = parsed[key];
      if (!val || val === '') {
        issues.push({ type: 'warning', message: `Empty image field found: ${key}` });
      }
    }
  });

  // Recursive check for arrays (e.g., stats, gallery)
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      issues.push({ type: 'error', message: 'Section contains an empty list.' });
    }
  }

  return issues;
};

const safeParse = (str) => {
  try { return JSON.parse(str); } catch (e) { return {}; }
};
