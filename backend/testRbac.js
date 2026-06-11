const { generateToken } = require('./src/utils/jwt');
const http = require('http');
const app = require('./src/app');

let server;

async function runTests() {
  await new Promise((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1/test`;

  try {
    const prisma = require('./src/config/database');
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Create temp departments
    const deptA = await prisma.department.create({ data: { name: 'Dept A', code: 'DEPT-A-'+Date.now() } });
    const deptB = await prisma.department.create({ data: { name: 'Dept B', code: 'DEPT-B-'+Date.now() } });

    // Create temp users
    const su = await prisma.user.create({ data: { name: 'su', username: 'su'+Date.now(), email: 'su'+Date.now()+'@x.com', passwordHash, role: 'SUPER_ADMIN' }});
    const da = await prisma.user.create({ data: { name: 'da', username: 'da'+Date.now(), email: 'da'+Date.now()+'@x.com', passwordHash, role: 'DEPARTMENT_ADMIN', departmentId: deptA.id }});
    const fe = await prisma.user.create({ data: { name: 'fe', username: 'fe'+Date.now(), email: 'fe'+Date.now()+'@x.com', passwordHash, role: 'FACULTY_EDITOR', departmentId: deptB.id }});
    const pc = await prisma.user.create({ data: { name: 'pc', username: 'pc'+Date.now(), email: 'pc'+Date.now()+'@x.com', passwordHash, role: 'PLACEMENT_CELL' }});

    const superAdminToken = generateToken({ id: su.id, role: su.role });
    const deptAdminToken = generateToken({ id: da.id, role: da.role, departmentId: da.departmentId });
    const facultyToken = generateToken({ id: fe.id, role: fe.role, departmentId: fe.departmentId });
    const placementToken = generateToken({ id: pc.id, role: pc.role });

    const makeRequest = async (route, token) => {
      const res = await fetch(`${baseUrl}${route}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.status;
    };

    console.log('Testing SUPER_ADMIN access...');
    let s1 = await makeRequest('/super-admin', superAdminToken);
    let s2 = await makeRequest('/department', superAdminToken);
    let s3 = await makeRequest('/faculty', superAdminToken);
    let s4 = await makeRequest('/placement', superAdminToken);
    let s5 = await makeRequest('/department/any-dept', superAdminToken);
    if (s1 === 200 && s2 === 200 && s3 === 200 && s4 === 200 && s5 === 200) console.log('✅ SUPER_ADMIN can access all routes');
    else console.log('❌ SUPER_ADMIN failed', {s1,s2,s3,s4,s5});

    console.log('Testing DEPARTMENT_ADMIN access...');
    s1 = await makeRequest('/department', deptAdminToken);
    if (s1 === 200) console.log('✅ DEPARTMENT_ADMIN can access department routes');
    else console.log('❌ DEPARTMENT_ADMIN failed', s1);

    s2 = await makeRequest('/placement', deptAdminToken);
    if (s2 === 403) console.log('✅ DEPARTMENT_ADMIN cannot access placement routes');
    else console.log('❌ DEPARTMENT_ADMIN should have failed on placement', s2);

    console.log('Testing FACULTY_EDITOR access...');
    s1 = await makeRequest('/super-admin', facultyToken);
    if (s1 === 403) console.log('✅ FACULTY_EDITOR cannot access admin routes');
    else console.log('❌ FACULTY_EDITOR failed', s1);

    console.log('Testing PLACEMENT_CELL access...');
    s1 = await makeRequest('/faculty', placementToken);
    if (s1 === 403) console.log('✅ PLACEMENT_CELL cannot access faculty routes');
    else console.log('❌ PLACEMENT_CELL failed', s1);

    console.log('Testing Department ownership restrictions...');
    s1 = await makeRequest(`/department/${deptA.id}`, deptAdminToken);
    s2 = await makeRequest(`/department/${deptB.id}`, deptAdminToken);
    if (s1 === 200 && s2 === 403) console.log('✅ Department ownership restrictions work');
    else console.log('❌ Department ownership restrictions failed', {s1,s2});

  } catch (error) {
    console.error('Test script error:', error);
  } finally {
    server.close();
  }
}

runTests();
