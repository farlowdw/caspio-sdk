const axios = require('axios');
const axiosErrorHandler = require('../src/utils/axios-error-handler');

/**
 * Authentication methods.
 *
 * @namespace Authentications
 */

function caspioAuthenticator(credentials) {
  let getAccessToken;
  try {
    if (!Object.prototype.hasOwnProperty.call(credentials, 'clientID')) {
      throw new Error('No value specified for clientID');
    }

    if (!Object.prototype.hasOwnProperty.call(credentials, 'clientSecret')) {
      throw new Error('No value specified for clientSecret');
    }

    if (!Object.prototype.hasOwnProperty.call(credentials, 'tokenEndpointURL')) {
      throw new Error('No value specified for tokenEndpointURL');
    }

    const { clientID, clientSecret, tokenEndpointURL } = credentials;

    /**
     * Returns a valid bearer token with active `access_token` and `refresh_token` properties that expires in `86399` seconds (i.e., `24` hours).
     *
     * Assumes its parent function has been called in a manner similar to the following: `const getAccessToken = require('caspio-sdk/auth')(authCredentials);`, where `authCredentials` is an object of the following form: `{ 'clientID': string, 'clientSecret': string, 'tokenEndpointURL': string }`.
     *
     * **Note 1 (usage):** For this function to be used effectively, its parent function *must* be called with an object that has the following properties with valid values, as illustrated above: `clientID`, `clientSecret`, and `tokenEndpointURL`.
     *
     * **Note 2 (validity of previously issued tokens):** Calling this function *does not* invalidate any previously issued access tokens. All access tokens obtained are valid for `24` hours.
     *
     * **Note 3 (guidance in finding necessary values):** The `clientID`, `clientSecret`, and `tokenEndpointURL` values may all be found (or activated) within a Caspio account in the following manner: Access permissions (from header menu) -> Web services profiles -> Selected profile.
     *
     * @memberOf Authentications
     * @returns {Promise<{access_token: string, token_type: 'bearer', expires_in: 86399, refresh_token: string}>} Bearer token with active `access_token` and `refresh_token` properties that expires in `86399` seconds (i.e., `24` hours). The `access_token` is the valuable data here--all requests to Caspio's REST API require usage of a valid `access_token`.
     * @since 1.0.0
     * @example
     * // get a valid bearer token for a Caspio account with an activated web services profile
     * const authCredentials = {
     *   clientID: process.env.CASPIO_CLIENT_ID,
     *   clientSecret: process.env.CASPIO_CLIENT_SECRET,
     *   tokenEndpointURL: process.env.CASPIO_TOKEN_ENDPOINT_URL
     * }
     *
     * const getAccessToken = require('caspio-sdk/auth')(authCredentials);
     *
     * async function getAccountBearerToken() {
     *   const bearerToken = await getAccessToken();
     *   console.log(bearerToken);
     *   return bearerToken;
     * }
     *
     * getAccountBearerToken();
     *
     * // sample return value
     * {
     *   access_token: 'uAnmAE_cHVhzCygc4k2kNkgAf6OJFLUhyy7wqMDZ__jRZZyoz2EHTgi0c-8IF1Cdv67GQxRTTe5kqASxvGOZtvXs8YsSIgBdgenI59-5Jrz15eJpf-yrZ-ef-TPIqViV-miw4KkjnmrFN6llVgNynu-8NvEyIwUblMAZRAOHo4xa4XQCvn-0sOxVWwC8UqaSauQ1_rqwTGtZwuhsRZ5FmFTSC9x00-XlXrZtq7wOTgfxIgxlY2EfGbi3PKp43G4K-70l6qahEl12YtL9QoRi1c1m992An3MFvhB5U3mskG0MHUXO9BbVtgToOdXralzqNZP-2zofXY870S22L63zokXT2DuLrg1KBXg0WqNP7TeFfp6HlFuqGlp-UzJXj4PRdaKDVO-zN0nx7XIwCBjvJQ',
     *   token_type: 'bearer',
     *   expires_in: 86399,
     *   refresh_token: 'a08db9eae63c4b17b0bd992a4f42902c0662fee7bc4f40c78f7a9b870182ad2b'
     * }
     */
    getAccessToken = async () => {
      try {
        const refreshAccessTokenReq = await axios({
          method: 'post',
          url: tokenEndpointURL,
          headers: {
            Authorization: 'Basic',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: clientID,
            password: clientSecret,
          },
          data: 'grant_type=client_credentials',
        });
        return refreshAccessTokenReq.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          axiosErrorHandler(error);
        } else {
          console.error(error);
        }
        return false;
      }
    };
    return getAccessToken;
  } catch (error) {
    console.error(error);
  }
}

module.exports = caspioAuthenticator;
