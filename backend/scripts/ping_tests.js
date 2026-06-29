const urls = [
  'http://localhost:5000/api/v1/cms/pages/home',
  'http://localhost:5000/api/v1/cms/pages/departments',
  'http://localhost:5000/api/v1/cms/pages/about',
  'http://localhost:5173/',
  'http://localhost:5173/departments/cse',
  'http://localhost:5173/about/peoples-message'
];

async function checkUrls() {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`[${res.status}] ${url}`);
    } catch (err) {
      console.error(`[ERROR] ${url}: ${err.message}`);
    }
  }
}

checkUrls();
