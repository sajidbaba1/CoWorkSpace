const API_URL = 'http://localhost:5000/api';

async function testFlow() {
    try {
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';

        console.log('Registering user:', email);
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({ name: 'Test User', email, password, role: 'owner' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const registerData = await registerRes.json();
        const token = registerData.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        console.log('Fetching /workspaces/my...');
        const workspacesRes = await fetch(`${API_URL}/workspaces/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const workspacesData = await workspacesRes.json();
        console.log('Workspaces response status:', workspacesRes.status);
        console.log('Workspaces data:', workspacesData);

        console.log('Fetching /bookings/owner...');
        const bookingsRes = await fetch(`${API_URL}/bookings/owner`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const bookingsData = await bookingsRes.json();
        console.log('Bookings response status:', bookingsRes.status);
        console.log('Bookings data:', bookingsData);

    } catch (err) {
        console.error('Error during test:', err);
    }
}

testFlow();
