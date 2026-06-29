const bcrypt = require('bcrypt');
const prisma = require('./src/config/database');
const http = require('http');
const app = require('./src/app');

// We will start the server on a dynamic port
let server;

async function runTests() {
  // Start server
  await new Promise((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1/auth`;

  try {
    console.log('Cleaning up old test users...');
    await prisma.user.deleteMany({
      where: { username: { in: ['testuser1', 'suspendeduser'] } }
    });

    console.log('Creating test users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    
    await prisma.user.create({
      data: {
        name: 'Test User',
        username: 'testuser1',
        email: 'test1@example.com',
        passwordHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      }
    });

    await prisma.user.create({
      data: {
        name: 'Suspended User',
        username: 'suspendeduser',
        email: 'suspended@example.com',
        passwordHash,
        role: 'DEPARTMENT_ADMIN',
        status: 'SUSPENDED',
      }
    });

    let token = '';

    // Test 1: Valid login
    let res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser1', password: 'password123' })
    });
    let data = await res.json();
    if (res.status === 200 && data.success && data.token) {
      console.log('✅ Valid login works');
      token = data.token;
    } else {
      console.log('❌ Valid login failed', data);
    }

    // Test 2: Invalid password
    res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser1', password: 'wrongpassword' })
    });
    if (res.status === 401) console.log('✅ Invalid password correctly handled');
    else console.log('❌ Invalid password failed', res.status);

    // Test 3: Invalid username
    res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wronguser', password: 'password123' })
    });
    if (res.status === 401) console.log('✅ Invalid username correctly handled');
    else console.log('❌ Invalid username failed', res.status);

    // Test 4: Suspended user
    res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'suspendeduser', password: 'password123' })
    });
    if (res.status === 401) console.log('✅ Suspended user properly rejected');
    else console.log('❌ Suspended user failed', res.status);

    // Test 5: Missing token
    res = await fetch(`${baseUrl}/me`);
    if (res.status === 401) console.log('✅ Missing token properly rejected');
    else console.log('❌ Missing token failed', res.status);

    // Test 6: Invalid token
    res = await fetch(`${baseUrl}/me`, {
      headers: { 'Authorization': 'Bearer INVALID_TOKEN' }
    });
    if (res.status === 401) console.log('✅ Invalid token properly rejected');
    else console.log('❌ Invalid token failed', res.status);

    // Test 7: GET /auth/me works
    res = await fetch(`${baseUrl}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (res.status === 200 && data.success && data.user.username === 'testuser1') {
      console.log('✅ GET /auth/me works');
    } else {
      console.log('❌ GET /auth/me failed', res.status, data);
    }

    // Test 8: Logout works
    res = await fetch(`${baseUrl}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 200) console.log('✅ Logout endpoint works');
    else console.log('❌ Logout failed', res.status);

  } catch (error) {
    console.error('Test script error:', error);
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests();
