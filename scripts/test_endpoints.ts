import prisma from '../lib/prisma';

async function runHealthCheck() {
  console.log('==================================================');
  console.log('🔍 PAHADI CROPSATHI - SYSTEM CONNECTIONS & ENDPOINTS HEALTH CHECK');
  console.log('==================================================\n');

  // 1. Check Supabase Database
  try {
    const userCount = await prisma.user.count();
    const postCount = await prisma.communityPost.count();
    const marketCount = await prisma.marketPrice.count();
    const otpCount = await prisma.otpVerification.count();

    console.log('✅ Supabase PostgreSQL Database: CONNECTED');
    console.log(`   - Registered Users: ${userCount}`);
    console.log(`   - Community Posts: ${postCount}`);
    console.log(`   - Market Items: ${marketCount}`);
    console.log(`   - Active OTP Tokens: ${otpCount}\n`);
  } catch (err: any) {
    console.error('❌ Supabase DB Connection FAILED:', err.message);
  }

  // 2. Check Local Next.js API Endpoints
  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    { name: 'Market API', path: '/api/market', method: 'GET' },
    { name: 'Community API', path: '/api/community', method: 'GET' },
    { name: 'Auth CSRF', path: '/api/auth/csrf', method: 'GET' },
    { name: 'Send OTP API', path: '/api/auth/send-otp', method: 'POST', body: { email: 'test_healthcheck@example.com' } },
    { name: 'Verify OTP API (Invalid OTP Test)', path: '/api/auth/verify-otp', method: 'POST', body: { email: 'test_healthcheck@example.com', otp: '000000' } }
  ];

  console.log('🌐 Testing API Endpoints (http://localhost:3000):');
  for (const ep of endpoints) {
    try {
      const options: any = { method: ep.method };
      if (ep.body) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(ep.body);
      }
      const res = await fetch(baseUrl + ep.path, options);
      const isOk = res.status < 500;
      console.log(`   ${isOk ? '✅' : '❌'} [${res.status}] ${ep.method} ${ep.path} (${ep.name})`);
    } catch (err: any) {
      console.log(`   ❌ FAILED: ${ep.method} ${ep.path} - ${err.message}`);
    }
  }

  console.log('\n==================================================');
  console.log('✨ All Connection Checks Finished.');
  console.log('==================================================');
  process.exit(0);
}

runHealthCheck();
