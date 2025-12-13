const crypto = require('crypto');

exports.handler = async function(event, context) {
  // CORS headers to allow your frontend to talk to this function
  const headers = {
    'Access-Control-Allow-Origin': '*', // Adjust this to your specific domain in production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET'
  };

  try {
    // 1. Get credentials from Netlify Environment Variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    
    if (!privateKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server configuration error: Missing Private Key" })
      };
    }

    // 2. Generate the Auth Parameters
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
    const privateKeyString = privateKey;
    
    // 3. Create Signature (HMAC-SHA1)
    // Signature = HMAC-SHA1(token + expire, privateKey)
    const signature = crypto
      .createHmac('sha1', privateKeyString)
      .update(token + expire.toString())
      .digest('hex');

    // 4. Return safely to frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
        expire,
        signature
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};