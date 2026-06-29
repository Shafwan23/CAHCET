const { generateToken } = require('./src/utils/jwt');
const app = require('./src/app');

let server;

async function runTests() {
  await new Promise((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1/cms`;

  try {
    const prisma = require('./src/config/database');
    const su = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' }});
    const da = await prisma.user.findFirst({ where: { role: 'DEPARTMENT_ADMIN' }});

    const superAdminToken = generateToken({ id: su.id, role: su.role });
    const deptAdminToken = generateToken({ id: da.id, role: da.role });

    const makeRequest = async (method, route, token, body = null) => {
      const res = await fetch(`${baseUrl}${route}`, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json().catch(() => null);
      return { status: res.status, data };
    };

    console.log('--- Testing CMS Permissions ---');
    // DA trying to create a page should fail
    let res = await makeRequest('POST', '/pages', deptAdminToken, { title: 'Test', slug: 'test' });
    if (res.status === 403) console.log('✅ DEPARTMENT_ADMIN correctly blocked from creating pages');
    else console.log('❌ Permission enforcement failed for DA', res);

    console.log('--- Testing Page CRUD ---');
    // Create Page
    res = await makeRequest('POST', '/pages', superAdminToken, { title: 'New Page', slug: 'new-page' });
    if (res.status === 201) console.log('✅ SUPER_ADMIN can create pages');
    else console.log('❌ Page creation failed', res);
    const pageId = res.data?.data?.id;

    // Slug Uniqueness
    res = await makeRequest('POST', '/pages', superAdminToken, { title: 'Duplicate', slug: 'new-page' });
    if (res.status === 400) console.log('✅ Slug uniqueness enforced');
    else console.log('❌ Slug uniqueness failed', res);

    // Update Page
    res = await makeRequest('PUT', `/pages/${pageId}`, superAdminToken, { title: 'Updated Title' });
    if (res.status === 200 && res.data.data.title === 'Updated Title') console.log('✅ Page update works');
    else console.log('❌ Page update failed', res);

    // Publish Page
    res = await makeRequest('PATCH', `/pages/${pageId}/publish`, superAdminToken);
    if (res.status === 200 && res.data.data.status === 'PUBLISHED') console.log('✅ Publish workflow works');
    else console.log('❌ Publish workflow failed', res);

    console.log('--- Testing Section CRUD ---');
    // Create Section
    res = await makeRequest('POST', '/sections', superAdminToken, { pageId, sectionKey: 'hero', title: 'Welcome' });
    if (res.status === 201) console.log('✅ Section creation works');
    else console.log('❌ Section creation failed', res);
    const sectionId = res.data?.data?.id;

    // Update Section
    res = await makeRequest('PUT', `/sections/${sectionId}`, superAdminToken, { title: 'Updated Welcome' });
    if (res.status === 200 && res.data.data.title === 'Updated Welcome') console.log('✅ Section update works');
    else console.log('❌ Section update failed', res);

    // Get Sections
    res = await makeRequest('GET', `/sections/${pageId}`, superAdminToken);
    if (res.status === 200 && res.data.data.length > 0) console.log('✅ Sections fetched successfully');
    else console.log('❌ Sections fetch failed', res);

    console.log('--- Cleanup ---');
    res = await makeRequest('DELETE', `/pages/${pageId}`, superAdminToken);
    if (res.status === 200) console.log('✅ Cascading delete / Page delete works');
    else console.log('❌ Page delete failed', res);

  } catch (error) {
    console.error('Test script error:', error);
  } finally {
    server.close();
  }
}

runTests();
