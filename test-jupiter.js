// Test script to verify Jupiter API integration
const JUPITER_API_URL = 'https://lite-api.jup.ag/tokens/v2';
const JUPITER_SEARCH_URL = 'https://lite-api.jup.ag/tokens/v2/search';

async function testJupiterAPI() {
  console.log('🔍 Testing Jupiter API Integration');
  console.log('=====================================');
  
  try {
    // Test both endpoints
    console.log('📡 Testing Jupiter API endpoints...');
    
    // Test 1: Main tokens endpoint
    console.log('\n1. Testing main tokens endpoint:', JUPITER_API_URL);
    const response1 = await fetch(JUPITER_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('Response status:', response1.status);
    
    // Test 2: Search endpoint
    console.log('\n2. Testing search endpoint:', JUPITER_SEARCH_URL);
    const response2 = await fetch(JUPITER_SEARCH_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('Response status:', response2.status);
    
    // Test 3: Try with a query parameter
    console.log('\n3. Testing search with query parameter...');
    const response3 = await fetch(`${JUPITER_SEARCH_URL}?query=SOL`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('Response status:', response3.status);
    
    // Test 4: Try with empty query (to get all tokens)
    console.log('\n4. Testing search with empty query...');
    const response4 = await fetch(`${JUPITER_SEARCH_URL}?query=`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('Response status:', response4.status);
    
    // Use the first successful response
    let response = response1;
    if (response1.ok) {
      console.log('✅ Main tokens endpoint works');
    } else if (response2.ok) {
      console.log('✅ Search endpoint works');
      response = response2;
    } else if (response3.ok) {
      console.log('✅ Search with query works');
      response = response3;
    } else if (response4.ok) {
      console.log('✅ Search with empty query works');
      response = response4;
    } else {
      throw new Error(`All Jupiter API endpoints failed. Statuses: ${response1.status}, ${response2.status}, ${response3.status}, ${response4.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Jupiter API Response:', {
      status: response.status,
      itemsCount: data?.length,
      firstToken: data?.[0] ? {
        id: data[0].id,
        name: data[0].name,
        symbol: data[0].symbol,
        launchpad: data[0].launchpad,
        mcap: data[0].mcap,
        usdPrice: data[0].usdPrice,
        liquidity: data[0].liquidity,
        createdAt: data[0].firstPool?.createdAt
      } : null
    });
    
    // Test data transformation
    if (data && data.length > 0) {
      const sampleToken = data[0];
      console.log('\n🔄 Testing Data Transformation:');
      
      // Determine status based on Jupiter data
      let status = 'fresh';
      if (sampleToken.stats24h?.numTraders && sampleToken.stats24h.numTraders > 10) {
        status = 'active';
      }
      if (sampleToken.launchpad === 'pump.fun' || sampleToken.bondingCurve > 0) {
        status = 'curve';
      }
      
      const transformedToken = {
        mint: sampleToken.id,
        name: sampleToken.name,
        symbol: sampleToken.symbol,
        decimals: sampleToken.decimals,
        supply: sampleToken.totalSupply,
        blocktime: new Date(sampleToken.firstPool.createdAt).getTime(),
        status,
        imageUrl: sampleToken.icon,
        marketcap: sampleToken.mcap,
        price_usd: sampleToken.usdPrice,
        volume_24h: sampleToken.stats24h?.buyVolume || 0,
        liquidity: sampleToken.liquidity,
        source: 'jupiter',
        website: sampleToken.website,
        twitter: sampleToken.twitter,
        links: {
          dexscreener: `https://dexscreener.com/solana/${sampleToken.id}`,
          jupiter: `https://jup.ag/swap/SOL-${sampleToken.id}`,
          explorer: `https://solscan.io/token/${sampleToken.id}`,
        },
        createdAt: new Date(sampleToken.firstPool.createdAt)
      };
      
      console.log('✅ Transformed Token:', {
        mint: transformedToken.mint,
        name: transformedToken.name,
        symbol: transformedToken.symbol,
        status: transformedToken.status,
        marketcap: transformedToken.marketcap,
        price_usd: transformedToken.price_usd,
        liquidity: transformedToken.liquidity,
        source: transformedToken.source,
        createdAt: transformedToken.createdAt.toISOString()
      });
    }
    
    console.log('\n🎉 Jupiter API integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Jupiter API test failed:', error.message);
  }
}

// Run the test
testJupiterAPI();
