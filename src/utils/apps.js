const axios = require('axios');
const axiosErrorHandler = require('./axios-error-handler');

function appUtils(credentials) {
  const { baseURL, headers: caspioHeaders } = require('./api-config')(credentials);

  /**
   * Utility function that makes it possible to identify an application by its name instead of by its ID
   * @returns {Promise.<Array.<Object>>} An array of objects where each object represents an application and its properties but where an additional key-value pair has been added, where the key is the name of the application and the key's value is the Application ID or `ExternalKey` for that application; this makes it possible to identify a application's ID by means of its name instead of having to know the application's ID directly
   */
  async function getAppKeyNameAssociations() {
    try {
      const apiReq = await axios({
        method: 'get',
        url: `${baseURL}/v2/applications`,
        headers: caspioHeaders,
      });
      const appsArr = apiReq.data.Result;
      appsArr.forEach((app) => {
        const appName = app.AppName;
        const appKey = app.ExternalKey;
        app[appName] = appKey;
      });
      return appsArr;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        axiosErrorHandler(error);
      } else {
        console.error(error);
      }
    }
  }

  /**
   * Utility function that makes it possible to return the properties for a single DataPage given the application ID to which the DataPage is associated along with the DataPage's name
   * @param {string} appExternalKey Application ID
   * @param {string} dataPageName DataPage name
   * @returns {Promise.<Object>} An object representing the found DataPage's properties
   */
  async function getDataPageProperties(appExternalKey, dataPageName) {
    let theReq;
    try {
      theReq = await axios({
        method: 'get',
        url: `${baseURL}/v2/applications/${appExternalKey}/datapages`,
        headers: caspioHeaders,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        axiosErrorHandler(error);
      } else {
        console.error(error);
      }
    }

    if (theReq) {
      try {
        const dataPagesPropertiesArr = theReq.data.Result;
        if (dataPagesPropertiesArr.length === 0) {
          throw new Error('No DataPages exist in this application.');
        }

        const lcDataPageName = dataPageName.toLowerCase();
        const lcDataPageNames = dataPagesPropertiesArr.map((dataPage) => dataPage.Name.toLowerCase());
        const dataPageFound = lcDataPageNames.includes(lcDataPageName);

        if (dataPageFound) {
          // return DataPage properties if found
          return dataPagesPropertiesArr.find((dataPage) => lcDataPageName === dataPage.Name.toLowerCase());
        }
        const appName = dataPagesPropertiesArr[0].AppName;
        const [lowerCaseFirstLetter, upperCaseFirstLetter] = [dataPageName[0].toLowerCase(), dataPageName[0].toUpperCase()];

        dataPagesPropertiesArr.sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));

        const dataPageCandidates = dataPagesPropertiesArr.filter((dataPage) => (dataPage.Name.startsWith(lowerCaseFirstLetter) || dataPage.Name.startsWith(upperCaseFirstLetter)));
        const allDataPageNamesPrettified = dataPagesPropertiesArr.map((dataPage) => `'${dataPage.Name}'\n`).join('');
        if (dataPageCandidates.length > 0) {
          const dataPageCandidatesPrettified = dataPageCandidates.map((dataPage) => `'${dataPage.Name}'\n`).join('');
          throw new Error(`'${dataPageName}' does not exist as a DataPage in the provided application: '${appName}'. The following DataPages in ${appName} begin with the same letter as the DataPage provided:\n\n${dataPageCandidatesPrettified}\nIf you are not looking for any of the DataPages above, then try any of the following DataPages from the '${appName}' application:\n\n${allDataPageNamesPrettified}\n`);
        } else {
          throw new Error(`'${dataPageName}' does not exist as a DataPage in the provided application: '${appName}'. Please try one of the following available DataPage names:\n\n${allDataPageNamesPrettified}\nPlease see if your desired DataPage name exists in the list above.\n`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Utility function that makes it possible to identify an application by its name rather than by its ID
   * @param {string} appName Application name
   * @returns {Promise.<string>} Application ID
   */
  async function appKeyGivenAppName(appName) {
    try {
      const appsArr = await getAppKeyNameAssociations();
      if (appsArr) {
        const foundApp = appsArr.find((app) => appName.toLowerCase() === app.AppName.toLowerCase());

        let externalKey;

        if (foundApp) {
          externalKey = foundApp[foundApp.AppName];
        } else {
          const possibleAppsStr = appsArr.map((app) => `\n'${app.AppName}'`).join('');
          throw new Error(`'${appName}' is not a valid name for an application. Try one of the following:\n${possibleAppsStr}\n`);
        }
        return externalKey;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   *
   * @param {string} appName Application name
   * @param {string} dataPageName DataPage name
   * @returns {Promise.<Array.<string, string>>} 2-element array with first element Application ID and second element DataPage ID
   */
  async function appAndDataPageKeysGivenNames(appName, dataPageName) {
    let dataPageProperties;
    const externalKey = await appKeyGivenAppName(appName);
    if (externalKey) {
      dataPageProperties = await getDataPageProperties(externalKey, dataPageName);
    }
    if (dataPageProperties) {
      const appKey = dataPageProperties.AppKey;
      return [externalKey, appKey];
    }
  }

  const utils = {
    appKeyGivenAppName,
    appAndDataPageKeysGivenNames,
  };

  return utils;
}

module.exports = appUtils;
