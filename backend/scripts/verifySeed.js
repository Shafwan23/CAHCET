const http = require('http');
const app = require('./src/app');

let server;

async function runTests() {
  await new Promise((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1`;

  const accounts = [
    { user: 'superadmin', pass: 'Super@CAHCET2026' },
    { user: 'cse_admin', pass: 'CSE@Admin2026' },
    { user: 'placement_admin', pass: 'Placement@2026' }
  ];

  try {
    console.log('--- Verifying Seeded User Authentication ---');
    for (const acc of accounts) {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: acc.user, password: acc.pass })
      });
      const data = await res.json();
      if (data.success) {
        console.log(`✅ Login successful for ${acc.user} (Role: ${data.user.role})`);
        
        // Test RBAC
        if (acc.user === 'cse_admin') {
          // Verify Department Admin can access /department
          const deptRes = await fetch(`${baseUrl}/test/department`, {
            headers: { Authorization: `Bearer ${data.token}` }
          });
          if (deptRes.status === 200) console.log(`   ✅ cse_admin accessed department route successfully.`);
          else console.log(`   ❌ cse_admin failed to access department route.`);

          // Verify they CANNOT access placement
          const placeRes = await fetch(`${baseUrl}/test/placement`, {
            headers: { Authorization: `Bearer ${data.token}` }
          });
          if (placeRes.status === 403) console.log(`   ✅ cse_admin correctly blocked from placement route.`);
          else console.log(`   ❌ cse_admin accessed placement route.`);
        }
      } else {
        console.log(`❌ Login FAILED for ${acc.user}`);
      }
    }
  } catch (error) {
    console.error('Verification error:', error);
  } finally {
    server.close();
  }
}

runTests();
