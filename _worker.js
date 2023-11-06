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
    return fetch(url, {
      headers: headers,
      method: request.method,
      body: request.body,
      redirect: 'follow'
    });
  }
}
