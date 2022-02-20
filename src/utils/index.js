/**
 * Returns an object with all utility methods needed for the main module to function correctly
 * @param {Object} apiCredentials Object with requisite `accountID` and `accessToken` properties.
 * @param {string} apiCredentials.accountID Account ID that can be obtained from the Token Endpoint URL for a web services profile in your Caspio account: https://<your-accountID>.caspio.com/oauth/token
 * @param {string} apiCredentials.accessToken Access token that ensures authentication of requests
 * @returns {Object} Object with information about the attempted creation of the specified table (i.e., `status`, `statusText`, and `message`).
 */
function utilsBundler(apiCredentials) {
  const axiosErrorHandler = require('./axios-error-handler');
  const casData = require('./caspio');
  const {
    whereClauseBuilder, stripPKIDFields, criteriaQueryBuilder, criteriaQueryBuilderPaginated,
  } = require('./data-processing');
  const apiConfig = require('./api-config')(apiCredentials);
  const { appKeyGivenAppName, appAndDataPageKeysGivenNames } = require('./apps')(apiCredentials);
  const { fileOrDirectoryMetadata, metadataByKey: fileMetadataByKey } = require('./files')(apiCredentials);
  const { taskKeysGivenTaskNames } = require('./tasks')(apiCredentials);

  const utils = {
    apiConfig,
    appAndDataPageKeysGivenNames,
    appKeyGivenAppName,
    axiosErrorHandler,
    casData,
    criteriaQueryBuilder,
    criteriaQueryBuilderPaginated,
    fileOrDirectoryMetadata,
    fileMetadataByKey,
    stripPKIDFields,
    taskKeysGivenTaskNames,
    whereClauseBuilder,
  };

  return utils;
}

module.exports = utilsBundler;
