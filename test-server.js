// Test script to check Railway server endpoints
const SERVER_URL = 'https://servertest-production-6715.up.railway.app';

async function testEndpoints() {
  console.log('🔍 Testing Railway Server Endpoints');
  console.log('=====================================');
  
  const endpoints = [
    { name: 'Health Check', url: `${SERVER_URL}/health` },
    { name: 'Fresh Tokens', url: `${SERVER_URL}/api/tokens/fresh?limit=10` },
    { name: 'All Tokens', url: `${SERVER_URL}/api/tokens?limit=10` },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint.name}...`);
      console.log(`   URL: ${endpoint.url}`);
      
      const start = Date.now();
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      const duration = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Status: ${response.status} (${duration}ms)`);
        console.log(`   📊 Data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
        
        if (Array.isArray(data)) {
          console.log(`   📈 Items count: ${data.length}`);
          if (data.length > 0) {
            console.log(`   🔍 First item keys: ${Object.keys(data[0]).join(', ')}`);
            if (data[0].marketcap) {
              console.log(`   💰 Market cap: $${data[0].marketcap}`);
            }
          }
        } else if (data.items) {
          console.log(`   📈 Items count: ${data.items.length}`);
        }
      } else {
        console.log(`   ❌ Status: ${response.status} (${duration}ms)`);
        const errorText = await response.text();
        console.log(`   📝 Error: ${errorText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

testEndpoints().catch(console.error);
