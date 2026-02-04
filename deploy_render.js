const https = require('https');

const API_KEY = 'rnd_qYZeRYAlJp1v3NiZMrGPjFnbHwfF';
const REPO_URL = 'https://github.com/sajidbaba1/CoWorkSpace';
const MONGODB_URI = 'mongodb+srv://pathanadnan154_db_user:1234@cluster0.ljwb9rf.mongodb.net/?appName=Cluster0';
const JWT_SECRET = 'supersecretkey123';

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.render.com',
            path: '/v1' + path,
            method: method,
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(json);
                    } else {
                        reject({ statusCode: res.statusCode, error: json });
                    }
                } catch (e) {
                    reject({ statusCode: res.statusCode, error: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function deploy() {
    try {
        const ownerId = 'tea-cujqa0rv2p9s7385gus0';
        console.log('Owner ID:', ownerId);

        console.log('Creating Service...');
        const payload = {
            type: 'web_service',
            name: 'coworkspace-api-auto',
            ownerId: ownerId,
            repo: REPO_URL,
            branch: 'main',
            rootDir: 'server',
            autoDeploy: 'yes',
            serviceDetails: {
                env: 'node',
                region: 'oregon',
                envSpecificDetails: {
                    buildCommand: 'npm install',
                    startCommand: 'npm start'
                },
                envVars: [
                    { key: 'MONGODB_URI', value: MONGODB_URI },
                    { key: 'JWT_SECRET', value: JWT_SECRET },
                    { key: 'NODE_ENV', value: 'production' },
                    { key: 'PORT', value: '10000' } // Render default port
                ]
            }
        };

        const service = await request('POST', '/services', payload);
        console.log('Service Created!');
        console.log('Service ID:', service.id);
        console.log('Service URL:', service.serviceDetails.url);

        // Output URL to a file we can read easily
        const fs = require('fs');
        fs.writeFileSync('render_url.txt', service.serviceDetails.url);

    } catch (error) {
        console.error('Deployment Failed:', JSON.stringify(error, null, 2));
        process.exit(1);
    }
}

deploy();
