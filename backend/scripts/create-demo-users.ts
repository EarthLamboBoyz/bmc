
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const API_URL = 'http://127.0.0.1:3001/api';
const prisma = new PrismaClient();

async function createDemoUsers() {
    try {
        console.log('--- Creating Demo Users ---');

        // 1. Create Brand User
        const brandEmail = 'brand@demo.com';
        const brandPassword = 'password123';

        try {
            console.log(`Creating Brand: ${brandEmail}...`);
            await axios.post(`${API_URL}/auth/register`, {
                email: brandEmail,
                password: brandPassword,
                name: 'Demo Brand',
                role: 'brand',
                companyName: 'Demo Brand Co.'
            });
            console.log('✅ Brand created successfully.');
        } catch (error: any) {
            if (error.response?.status === 400) {
                console.log('ℹ️ Brand user already exists (probably from previous run).');
            } else {
                console.error('❌ Failed to create brand:', error.message);
            }
        }

        // 2. Create Creator User
        const creatorEmail = 'creator@demo.com';
        const creatorPassword = 'password123';

        try {
            console.log(`Creating Creator: ${creatorEmail}...`);
            await axios.post(`${API_URL}/auth/register`, {
                email: creatorEmail,
                password: creatorPassword,
                name: 'Demo Creator',
                role: 'creator',
                tiktokHandle: '@democreator'
            });
            console.log('✅ Creator created successfully.');
        } catch (error: any) {
            if (error.response?.status === 400) {
                console.log('ℹ️ Creator user already exists.');
            } else {
                console.error('❌ Failed to create creator:', error.message);
            }
        }

        console.log('\n--- Login Credentials ---');
        console.log('BRAND:');
        console.log(`Email: ${brandEmail}`);
        console.log(`Password: ${brandPassword}`);
        console.log('\nCREATOR:');
        console.log(`Email: ${creatorEmail}`);
        console.log(`Password: ${creatorPassword}`);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createDemoUsers();
