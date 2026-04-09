async function runTests() {
    console.log('--- Setting up user for Phase 2 tests ---');
    let token;
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Phase 2 Test',
            email: `test${Date.now()}@test.com`,
            password: 'password123',
            phone: '8888888888'
        })
    });

    if (!regRes.ok) throw new Error('Registration failed');
    const d = await regRes.json();
    token = d.token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    console.log('\nTesting GET /api/users/profile');
    const profGet = await fetch('http://localhost:5000/api/users/profile', { headers });
    if (!profGet.ok) throw new Error('GET profile failed: ' + await profGet.text());
    console.log('GET Profile OK');

    console.log('\nTesting PUT /api/users/profile');
    const profUpdate = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ age: 25, bloodGroup: 'O+' })
    });
    if (!profUpdate.ok) throw new Error('PUT profile failed');
    const ud = await profUpdate.json();
    console.log('PUT Profile OK. Age:', ud.age, 'Blood:', ud.bloodGroup);

    console.log('\nTesting PUT /api/users/skills');
    const sUpdate = await fetch('http://localhost:5000/api/users/skills', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ skills: ['Medical', 'Car Diagnosis Skill'] })
    });
    if (!sUpdate.ok) throw new Error('PUT skills failed');
    const sd = await sUpdate.json();
    console.log('PUT Skills OK. Skills length:', sd.skills.length);

    console.log('\nTesting PUT /api/users/location');
    const lUpdate = await fetch('http://localhost:5000/api/users/location', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ x: 50, y: 150 })
    });
    if (!lUpdate.ok) throw new Error('PUT location failed');
    const ld = await lUpdate.json();
    console.log('PUT Location OK. Coords:', ld.x, ld.y);

    console.log('\nTesting GET /api/users/nearby');
    const nGet = await fetch('http://localhost:5000/api/users/nearby?x=50&y=150', { headers });
    if (!nGet.ok) throw new Error('GET nearby failed');
    const nearData = await nGet.json();
    console.log('GET nearby OK. Users found:', nearData.length);

    console.log('\nTesting POST /api/users/guardians');
    // Need another user to be a guardian
    const guardEmail = `guardian${Date.now()}@test.com`;
    await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Guardian', email: guardEmail, password: 'password123' })
    });

    const gPost = await fetch('http://localhost:5000/api/users/guardians', {
        method: 'POST',
        headers,
        body: JSON.stringify({ guardianEmail: guardEmail })
    });
    if (!gPost.ok) throw new Error('POST guardian failed: ' + await gPost.text());
    const gData = await gPost.json();
    const loadedG = gData[0];
    console.log('POST guardian OK. Added guardian ID.');

    console.log('\nTesting GET /api/users/guardians');
    const gGet = await fetch('http://localhost:5000/api/users/guardians', { headers });
    if (!gGet.ok) throw new Error('GET guardians failed');
    const gListData = await gGet.json();
    console.log('GET guardians OK. Count:', gListData.length);

    const targetGuardianId = gListData[0]._id;

    console.log('\nTesting DELETE /api/users/guardians/:id');
    const gDel = await fetch(`http://localhost:5000/api/users/guardians/${targetGuardianId}`, {
        method: 'DELETE',
        headers
    });
    if (!gDel.ok) throw new Error('DELETE guardians failed: ' + await gDel.text());
    console.log('DELETE guardian OK. Updated count:', (await gDel.json()).length);

    console.log('\nTesting GET /api/users/:id/public');
    const pGet = await fetch(`http://localhost:5000/api/users/${d.id || d._id}/public`, { headers });
    if (!pGet.ok) throw new Error('GET public failed');
    console.log('GET public OK. Name:', (await pGet.json()).name);

    console.log('\nPhase 2 tests completely passed!');
}

runTests().catch(console.error);
