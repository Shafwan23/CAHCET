async function test() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'superadmin',
        password: 'Super@Admin#2026'
      })
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
      console.log("Login failed:", loginData);
      return;
    }
    const token = loginData.token;
    
    // 2. Fetch stats
    const statsRes = await fetch('http://localhost:5000/api/v1/cms/admin-dashboard-stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!statsRes.ok) {
      console.log("Error Status:", statsRes.status);
      console.log("Error Text:", await statsRes.text());
    } else {
      const statsData = await statsRes.json();
      console.log("Success:", statsData);
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
}

test();
