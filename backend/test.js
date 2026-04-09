async function runTests() {
    console.log('Testing /api/auth/register');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test Setup',
            email: `test${Date.now()}@test.com`,
            password: 'password123',
            phone: '9999999999'
        })
    });

    if (!regRes.ok) throw new Error('Register failed: ' + await regRes.text());
    const regData = await regRes.json();
    console.log('Register OK:', regData.email, 'Token exists:', !!regData.token);

    const token = regData.token;
    const cookieHeaders = regRes.headers.get('set-cookie');
    console.log('Set-Cookie received:', !!cookieHeaders);

    console.log('\nTesting /api/auth/me');
    const meRes = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!meRes.ok) throw new Error('Me failed: ' + await meRes.text());
    const meData = await meRes.json();
    console.log('Me OK:', meData.email);

    console.log('\nTesting /api/auth/login');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: regData.email,
            password: 'password123'
        })
    });
    if (!loginRes.ok) throw new Error('Login failed: ' + await loginRes.text());
    console.log('Login OK. isOnline set to true behind the scenes');

    console.log('\nTesting /api/auth/logout');
    const logoutRes = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!logoutRes.ok) throw new Error('Logout failed: ' + await logoutRes.text());
    console.log('Logout OK');

    console.log('\nAll tests passed.');
}

runTests().catch(console.error);
