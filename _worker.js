export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    url.host = "api.github.com";

    // Clone the request headers so we can modify them
    const headers = new Headers(request.headers);

    // Check if the x-token header is present
    const xToken = headers.get('x-token');
    if (xToken) {
      // Normalize the x-token value to create the environment variable name
      const envVarName = `X_TOKEN_${xToken.replace(/-/g, '_').toUpperCase()}`;
      // Retrieve the value from the environment variables
      const tokenValue = env[envVarName];
      // Set the Authorization header with the token value
      if (tokenValue) {
        headers.set('Authorization', `token ${tokenValue}`);
      }
    }

    // Proceed with the fetch request using the modified headers
    const response = await fetch(url, {
      headers: headers,
      method: request.method,
      body: request.body,
      redirect: 'follow'
    });

    // Clone the response so we can modify the headers
    const newResponse = new Response(response.body, response);

    // Set CORS headers
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token');

    // Return the modified response
    return newResponse;
  }
}
