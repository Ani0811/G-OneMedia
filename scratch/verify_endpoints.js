// Using native global fetch (Node 18+)

async function testContact() {
  console.log('--- Testing /api/contact endpoint ---');
  const start = Date.now();
  try {
    const res = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Bot',
        email: 'anirudha.basuthakur@gmail.com',
        message: '📊 Budget Estimate Request\nServices: Website / Web App\nTimeline: Normal (2-4 weeks)\nEstimated Budget: ₹23K\nNotes: Automated endpoint performance test.'
      })
    });
    const duration = Date.now() - start;
    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', json);
    console.log(`Duration: ${duration}ms`);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testDiscovery() {
  console.log('\n--- Testing /api/discovery endpoint ---');
  const start = Date.now();
  try {
    const res = await fetch('http://localhost:3001/api/discovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Bot',
        email: 'anirudha.basuthakur@gmail.com',
        company: 'Verification Corp',
        website: 'verification.com',
        service: 'AI Agents',
        budget: '₹50,000 – ₹1,50,000',
        details: 'Automated test of discovery call booking flow.',
        referral: 'Google'
      })
    });
    const duration = Date.now() - start;
    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', json);
    console.log(`Duration: ${duration}ms`);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function run() {
  await testContact();
  await testDiscovery();
}

run();
