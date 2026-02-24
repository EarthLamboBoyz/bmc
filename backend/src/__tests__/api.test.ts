import request from 'supertest';
import app from '../app';

describe('Health Check', () => {
    it('GET /health should return 200', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
});

describe('Auth API', () => {
    const testUser = {
        email: `test_${Date.now()}@test.com`,
        password: 'TestPassword123!',
        name: 'Test Creator',
        role: 'CREATOR',
        displayName: 'Test Creator',
    };

    let token: string;

    it('POST /api/auth/register should create a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', testUser.email);
        token = res.body.token;
    });

    it('POST /api/auth/login should return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', testUser.email);
        token = res.body.token;
    });

    it('GET /api/auth/me should return current user', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe(testUser.email);
    });

    it('GET /api/auth/me without token should return 401', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
    });
});

describe('Campaigns API', () => {
    let creatorToken: string;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'creator@demo.com', password: 'password123' });
        if (res.body.token) {
            creatorToken = res.body.token;
        }
    });

    it('GET /api/campaigns should return campaigns array', async () => {
        if (!creatorToken) return; // Skip if demo user doesn't exist
        const res = await request(app)
            .get('/api/campaigns')
            .set('Authorization', `Bearer ${creatorToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/campaigns should only return LIVE campaigns for non-owners', async () => {
        if (!creatorToken) return;
        const res = await request(app)
            .get('/api/campaigns')
            .set('Authorization', `Bearer ${creatorToken}`);

        expect(res.status).toBe(200);
        if (res.body.length > 0) {
            res.body.forEach((campaign: any) => {
                expect(['LIVE', 'live']).toContain(campaign.status);
            });
        }
    });
});

describe('Dashboard API', () => {
    let creatorToken: string;
    let brandToken: string;

    beforeAll(async () => {
        const creatorRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'creator@demo.com', password: 'password123' });
        if (creatorRes.body.token) creatorToken = creatorRes.body.token;

        const brandRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'brand@demo.com', password: 'password123' });
        if (brandRes.body.token) brandToken = brandRes.body.token;
    });

    it('GET /api/dashboard/creator should return creator stats', async () => {
        if (!creatorToken) return;
        const res = await request(app)
            .get('/api/dashboard/creator')
            .set('Authorization', `Bearer ${creatorToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('totalEarnings');
        expect(res.body.data).toHaveProperty('pendingEarnings');
        expect(res.body.data).toHaveProperty('activeCampaigns');
        expect(res.body.data).toHaveProperty('totalVideos');
    });

    it('GET /api/dashboard/brand should return brand stats', async () => {
        if (!brandToken) return;
        const res = await request(app)
            .get('/api/dashboard/brand')
            .set('Authorization', `Bearer ${brandToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('activeCampaigns');
        expect(res.body.data).toHaveProperty('totalCreators');
        expect(res.body.data).toHaveProperty('totalSpent');
    });

    it('should reject unauthenticated requests', async () => {
        const res = await request(app).get('/api/dashboard/creator');
        expect(res.status).toBe(401);
    });
});
