/**
 * Returns an object with a `baseURL` property which serves as the base URL to issue API requests to and a `headers` property which provides the headers necessary for most API requests.
 * @param {Object} credentials Object with requisite `accountID` and `accessToken` properties.
 * @param {string} credentials.accountID Account ID that can be obtained from the Token Endpoint URL for a web services profile in your Caspio account: https://<your-accountID>.caspio.com/oauth/token
 * @param {string} credentials.accessToken Access token that ensures authentication of requests
 * @returns {{baseURL: string, headers: {authoriztion: string, content-type: 'application/json', accept: 'application/json'}}} Object with information about the attempted creation of the specified table (i.e., `status`, `statusText`, and `message`).
 */
function apiConfig(credentials) {
  const { accountID, accessToken } = credentials;
  const config = {
    baseURL: `https://${accountID}.caspio.com/rest`,
    headers: {
      authorization: `bearer ${accessToken}`,
      'content-type': 'application/json',
      accept: 'application/json',
    },
  };
  return config;
}

module.exports = apiConfig;
