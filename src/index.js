const fs = require('fs');
const path = require('path');
const axios = require('axios');
const JSONStream = require('JSONStream');
const FormData = require('form-data');

function apiWrapper(credentials) {
  try {
    if (!Object.prototype.hasOwnProperty.call(credentials, 'accessToken')) {
      throw new Error('No API accessToken specified.');
    }

    if (!Object.prototype.hasOwnProperty.call(credentials, 'accountID')) {
      throw new Error('No Caspio accountID provided.');
    }

    const _utils = require('./utils')(credentials);

    const { baseURL, headers: caspioHeaders } = _utils.apiConfig;

    const api = {
      /**
       * Methods for applications.
       *
       * @namespace Applications
       */
      apps: {
        /**
         * Returns list of applications (i.e., an array of objects where each object represents an application and its properties).
         *
         * @memberOf Applications
         * @returns {Promise<Array<{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}>>} Array of Caspio applications with each application's properties
         * @since 1.0.0
         * @example
         * // get list of all Caspio applications linked to a Caspio account
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getAllAppProperties() {
         *   const propertiesForAllApps = await caspio.apps.listing();
         *   console.log(propertiesForAllApps);
         *   return propertiesForAllApps;
         * }
         *
         * getAllAppProperties();
         *
         * // sample return value
         * [
         *   ...,
         *   {
         *     AppName: 'Demo - Physician Directory - Caspio SDK',
         *     ExternalKey: '09d18152-7c45-44f1-a0e6-5ffe18881b60',
         *     DataPagesCount: 5,
         *     DateCreated: '2022-01-25T15:17:10.607',
         *     DateModified: '2022-01-25T15:20:44.850',
         *     DefaultIcon: true,
         *     IconFileName: ''
         *   },
         *   ...
         * ]
         */
        listing: async () => {
          try {
            const apiReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/applications`,
              headers: caspioHeaders,
            });
            return apiReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns the application's properties (i.e., an object that represents an application's properties given the application's case-insensitive name, `appName`).
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @returns {Promise<{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}>} Object representing a Caspio application and its properties
         * @since 1.0.0
         * @example
         * // get properties of the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getAppProperties() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const appProperties = await caspio.apps.propertiesByName(APP_NAME);
         *   console.log(appProperties);
         *   return appProperties;
         * }
         *
         * getAppProperties();
         *
         * // sample return value
         * {
         *   AppName: 'Demo - Physician Directory - Caspio SDK',
         *   ExternalKey: '09d18152-7c45-44f1-a0e6-5ffe18881b60',
         *   DataPagesCount: 5,
         *   DateCreated: '2022-01-25T15:17:10.607',
         *   DateModified: '2022-01-25T15:20:44.850',
         *   DefaultIcon: true,
         *   IconFileName: ''
         * }
         */
        propertiesByName: async (appName) => {
          const externalKey = await _utils.appKeyGivenAppName(appName);

          if (externalKey) {
            try {
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/applications/${externalKey}`,
                headers: caspioHeaders,
              });
              return theReq.data.Result;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Returns the application's properties (i.e., an object that represents an application's properties given the application's ID, `externalKey`).
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @returns {Promise<{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}>} Object representing a Caspio application and its properties
         * @since 1.0.0
         * @example
         * // get properties of the 'Demo - Physician Directory - Caspio SDK' application
         * // whose application ID is '09d18152-7c45-44f1-a0e6-5ffe18881b60'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getAppProperties() {
         *   const APP_KEY = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const appProperties = await caspio.apps.propertiesByKey(APP_KEY);
         *   console.log(appProperties);
         *   return appProperties;
         * }
         *
         * getAppProperties();
         *
         * // sample return value
         * {
         *   AppName: 'Demo - Physician Directory - Caspio SDK',
         *   ExternalKey: '09d18152-7c45-44f1-a0e6-5ffe18881b60',
         *   DataPagesCount: 5,
         *   DateCreated: '2022-01-25T15:17:10.607',
         *   DateModified: '2022-01-25T15:20:44.850',
         *   DefaultIcon: true,
         *   IconFileName: ''
         * }
         */
        propertiesByKey: async (externalKey) => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/applications/${externalKey}`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns a list of DataPage properties for DataPages associated with an application (i.e., an array of objects where the objects represent an application's DataPages and their properties--the application is identified by its case-insensitive name, `appName`).
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @returns {Promise<Array<{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}>>} Array of DataPages and their properties linked to a specific application
         * @since 1.0.0
         * @example
         * // get all DataPage properties linked to the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpPropertiesForApp() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const dpProperties = await caspio.apps.dpPropertiesByAppName(APP_NAME);
         *   console.log(dpProperties);
         *   return dpProperties;
         * }
         *
         * dpPropertiesForApp();
         *
         * // sample return value
         * [
         *   ...,
         *   {
         *     Name: 'Physician Registration',
         *     AppKey: '409550008f83dc4dd4554a07b7bf',
         *     AppName: 'Demo - Physician Directory - Caspio SDK',
         *     Path: '/Public Interfaces',
         *     Type: 'WEBFORM',
         *     DateCreated: '2022-01-25T15:20:43.787',
         *     DateModified: '2022-01-25T15:20:43.837',
         *     CreatedBy: 'user@user.com',
         *     ModifiedBy: '',
         *     Note: ''
         *   },
         *   ...
         * ]
         */
        dpPropertiesByAppName: async (appName) => {
          const externalKey = await _utils.appKeyGivenAppName(appName);

          if (externalKey) {
            try {
              const apiReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/applications/${externalKey}/datapages`,
                headers: caspioHeaders,
              });
              return apiReq.data.Result;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Returns a list of DataPage properties for DataPages associated with an application (i.e., an array of objects where the objects represent an application's DataPages and their properties--the application is identified by its App ID, `externalKey`).
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @returns {Promise<Array<{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}>>} Array of DataPages and their properties linked to a specific application
         * @since 1.0.0
         * @example
         * // get all DataPage properties linked to the 'Demo - Physician Directory - Caspio SDK' application
         * // whose App ID is '09d18152-7c45-44f1-a0e6-5ffe18881b60'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpPropertiesForApp() {
         *   const APP_KEY = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const dpProperties = await caspio.apps.dpPropertiesByAppKey(APP_KEY);
         *   console.log(dpProperties);
         *   return dpProperties;
         * }
         *
         * dpPropertiesForApp();
         *
         * // sample return value
         * [
         *   ...,
         *   {
         *     Name: 'Physician Registration',
         *     AppKey: '409550008f83dc4dd4554a07b7bf',
         *     AppName: 'Demo - Physician Directory - Caspio SDK',
         *     Path: '/Public Interfaces',
         *     Type: 'WEBFORM',
         *     DateCreated: '2022-01-25T15:20:43.787',
         *     DateModified: '2022-01-25T15:20:43.837',
         *     CreatedBy: 'user@user.com',
         *     ModifiedBy: '',
         *     Note: ''
         *   },
         *   ...
         * ]
         */
        dpPropertiesByAppKey: async (externalKey) => {
          try {
            const apiReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/applications/${externalKey}/datapages`,
              headers: caspioHeaders,
            });
            return apiReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns the DataPage's properties (object) for the specified DataPage (i.e., `dataPageName`) linked to the specified application (i.e., `appName`), where both specifications are case-insensitive.
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @param {string} dataPageName Name of the DataPage (case-insensitive)
         * @returns {Promise<{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}>} Object representing the properties of the specified DataPage for the specified application
         * @since 1.0.0
         * @example
         * // get properties of the 'Physician Registration' DataPage which is a DataPage in
         * // the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpGetProperties() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const DP_NAME = 'Physician Registration';
         *   const dpProperties = await caspio.apps.dpPropertiesByNames(APP_NAME, DP_NAME);
         *   console.log(dpProperties);
         *   return dpProperties;
         * }
         *
         * dpGetProperties();
         *
         * // sample return value
         * {
         *   Name: 'Physician Registration',
         *   AppKey: '409550008f83dc4dd4554a07b7bf',
         *   AppName: 'Demo - Physician Directory - Caspio SDK',
         *   Path: '/Public Interfaces',
         *   Type: 'WEBFORM',
         *   DateCreated: '2022-01-25T15:20:43.787',
         *   DateModified: '2022-01-25T15:20:43.837',
         *   CreatedBy: 'user@user.com',
         *   ModifiedBy: '',
         *   Note: ''
         * }
         */
        dpPropertiesByNames: async (appName, dataPageName) => {
          const keyReq = await _utils.appAndDataPageKeysGivenNames(appName, dataPageName);

          if (keyReq) {
            try {
              const [externalKey, appKey] = keyReq;
              const apiReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}`,
                headers: caspioHeaders,
              });
              return apiReq.data.Result;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Returns the DataPage's properties (object) for the specified DataPage (i.e., `appKey`) linked to the specified application (i.e., `externalKey`).
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @param {string} appKey DataPage ID
         * @returns {Promise<{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}>} Object representing the properties of the specified DataPage for the specified application
         * @since 1.0.0
         * @example
         * // get properties of the 'Physician Registration' DataPage which is a DataPage in
         * // the 'Demo - Physician Directory - Caspio SDK' application
         * // 'Physician Registration' DataPage key: '409550008f83dc4dd4554a07b7bf'
         * // 'Demo - Physician Directory - Caspio SDK' application key: '09d18152-7c45-44f1-a0e6-5ffe18881b60'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpGetProperties() {
         *   const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const DP_ID = '409550008f83dc4dd4554a07b7bf';
         *   const dpProperties = await caspio.apps.dpPropertiesByKeys(APP_ID, DP_ID);
         *   console.log(dpProperties);
         *   return dpProperties;
         * }
         *
         * dpGetProperties();
         *
         * // sample return value
         * {
         *   Name: 'Physician Registration',
         *   AppKey: '409550008f83dc4dd4554a07b7bf',
         *   AppName: 'Demo - Physician Directory - Caspio SDK',
         *   Path: '/Public Interfaces',
         *   Type: 'WEBFORM',
         *   DateCreated: '2022-01-25T15:20:43.787',
         *   DateModified: '2022-01-25T15:20:43.837',
         *   CreatedBy: 'user@user.com',
         *   ModifiedBy: '',
         *   Note: ''
         * }
         */
        dpPropertiesByKeys: async (externalKey, appKey) => {
          try {
            const apiReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}`,
              headers: caspioHeaders,
            });
            return apiReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns deploy code (string) for a DataPage given an application name (i.e., `appName`), DataPage name (i.e., `dataPageName`), and deploy method (i.e., `deployMethod`), where all parameters are case-insensitive.
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @param {string} dataPageName Name of the DataPage (case-insensitive)
         * @param {('I'|'F'|'U'|'L'|'E'|'N'|'P'|'A'|'X'|'B'|'Y'|'Z')} deployMethod Deploy method (case-insensitive). Valid deploy methods: `I` (iFrame), `F` (Frame), `U` (URL), `L` (Link), `E` (Embedded), `N` (Net), `P` (PHP), `A` (ASP), `X` (ASPX), `B` (Facebook), `Y` (WordPress Frame), `Z` (WordPress Embed).
         *
         * **Note:** Deploy methods `P`, `A`, and `X` are SEO deployment methods and are only available to DataPages that meet certain criteria. If the criteria are not met, an error is thrown.
         *
         * @see Read the Caspio documentation on [SEO deployment directions](https://howto.caspio.com/deployment/seo-deployment-directions/seo-deployment-directions/) for more details.
         * @returns {Promise<string>} String representing the deploy code for the specified DataPage for the specified application
         * @since 1.0.0
         * @example
         * // get the URL deploy code of the 'Physician Registration' DataPage
         * // which lives in the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpGetDeployCode() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const DP_NAME = 'Physician Registration';
         *   const dpDeployCode = await caspio.apps.dpDeployCodeByNames(APP_NAME, DP_NAME, 'U');
         *   console.log(dpDeployCode);
         *   return dpDeployCode;
         * }
         *
         * dpGetDeployCode();
         *
         * // sample return value
         * 'https://ab1de2fg3.caspio.com/dp/409550008f83dc4dd4554a07b7bf'
         */
        dpDeployCodeByNames: async (appName, dataPageName, deployMethod) => {
          try {
            const validDeployMethods = Object.values(_utils.casData.deploymentMethods);
            const deployMethodUpper = deployMethod.toUpperCase();
            if (!validDeployMethods.includes(deployMethodUpper)) {
              throw new Error(`'${deployMethod}' is not a valid deploy method. Try one of the following: 'I', 'F', 'U', 'L', 'E', 'N', 'P', 'A', or 'X'. Note that you may experience issues when trying to use 'P', 'A', or 'X'. ('P', 'A', and 'X' are SEO deployment methods and are only available to DataPages that meet certain criteria.)`);
            }
          } catch (error) {
            console.error(error);
          }

          const keyReq = await _utils.appAndDataPageKeysGivenNames(appName, dataPageName);

          if (keyReq) {
            try {
              const [externalKey, appKey] = keyReq;
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}/deployment?method=${deployMethod}`,
                headers: caspioHeaders,
              });
              return theReq.data;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Returns deploy code (string) for a DataPage given an application's ID (i.e., `externalKey`), DataPage ID (i.e., `appKey`), and deploy method (i.e., `deployMethod`), where the `deployMethod` is case-insensitive.
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @param {string} appKey DataPage ID
         * @param {('I'|'F'|'U'|'L'|'E'|'N'|'P'|'A'|'X'|'B'|'Y'|'Z')} deployMethod Deploy method (case-insensitive). Valid deploy methods: `I` (iFrame), `F` (Frame), `U` (URL), `L` (Link), `E` (Embedded), `N` (Net), `P` (PHP), `A` (ASP), `X` (ASPX), `B` (Facebook), `Y` (WordPress Frame), `Z` (WordPress Embed).
         *
         * **Note:** Deploy methods `P`, `A`, and `X` are SEO deployment methods and are only available to DataPages that meet certain criteria. If the criteria are not met, an error is thrown.
         *
         * @see Read the Caspio documentation on [SEO deployment directions](https://howto.caspio.com/deployment/seo-deployment-directions/seo-deployment-directions/) for more details.
         * @returns {Promise<string>} String representing the deploy code for the specified DataPage for the specified application
         * @since 1.0.0
         * @example
         * // get the URL deploy code of the 'Physician Registration' DataPage
         * // which lives in the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpGetDeployCode() {
         *   const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const DP_ID = '409550008f83dc4dd4554a07b7bf';
         *   const dpDeployCode = await caspio.apps.dpDeployCodeByKeys(APP_ID, DP_ID, 'U');
         *   console.log(dpDeployCode);
         *   return dpDeployCode;
         * }
         *
         * dpGetDeployCode();
         *
         * // sample return value
         * 'https://ab1de2fg3.caspio.com/dp/409550008f83dc4dd4554a07b7bf'
         */
        dpDeployCodeByKeys: async (externalKey, appKey, deployMethod) => {
          try {
            const validDeployMethods = Object.values(_utils.casData.deploymentMethods);
            const deployMethodUpper = deployMethod.toUpperCase();
            if (!validDeployMethods.includes(deployMethodUpper)) {
              throw new Error(`'${deployMethod}' is not a valid deploy method. Try one of the following: 'I', 'F', 'U', 'L', 'E', 'N', 'P', 'A', or 'X'. Note that you may experience issues when trying to use 'P', 'A', or 'X'. ('P', 'A', and 'X' are SEO deployment methods and are only available to DataPages that meet certain criteria.)`);
            }
          } catch (error) {
            console.error(error);
          }

          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}/deployment?method=${deployMethod}`,
              headers: caspioHeaders,
            });
            return theReq.data;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Deploy a DataPage by specifying the name of the application to which the DataPage is linked (i.e., `appName`) as well as specifying the name of the DataPage itself (i.e., `dataPageName`).
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @param {string} dataPageName Name of the DataPage (case-insensitive)
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted deployment (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // deploy the 'Physician Registration' DataPage which is part of the
         * // 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDeploy() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const DP_NAME = 'Physician Registration';
         *   const deployResult = await caspio.apps.dpDeployByNames(APP_NAME, DP_NAME);
         *   console.log(deployResult);
         *   return deployResult;
         * }
         *
         * dpDeploy();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "DataPage 'Physician Registration' has been successfully deployed."
         * }
         */
        dpDeployByNames: async (appName, dataPageName) => {
          const keyReq = await _utils.appAndDataPageKeysGivenNames(appName, dataPageName);

          if (keyReq) {
            try {
              const [externalKey, appKey] = keyReq;
              const theReq = await axios({
                method: 'put',
                url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}/deployment`,
                headers: caspioHeaders,
              });
              const { status, statusText } = theReq;
              const message = `DataPage '${dataPageName}' has been successfully deployed.`;
              const responseObj = { status, statusText, message };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Deploy a DataPage by specifying the ID of the application to which the DataPage is linked (i.e., `externalKey`) as well as specifying the ID of the DataPage itself (i.e., `appKey`).
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @param {string} appKey DataPage ID
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted deployment (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // deploy the 'Physician Registration' DataPage which is part of the
         * // 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDeploy() {
         *   const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const DP_ID = '409550008f83dc4dd4554a07b7bf';
         *   const deployResult = await caspio.apps.dpDeployByKeys(APP_ID, DP_ID);
         *   console.log(deployResult);
         *   return deployResult;
         * }
         *
         * dpDeploy();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: 'DataPage successfully deployed.'
         * }
         */
        dpDeployByKeys: async (externalKey, appKey) => {
          try {
            const theReq = await axios({
              method: 'put',
              url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}/deployment`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = 'DataPage successfully deployed.';
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Disable a DataPage by specifying the name of the application to which the DataPage is linked (i.e., `appName`) as well as specifying the name of the DataPage itself (i.e., `dataPageName`).
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @param {string} dataPageName Name of the DataPage (case-insensitive)
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the disable attempt (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // disable the 'Physician Registration' DataPage which is part of the
         * // 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDisable() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const DP_NAME = 'Physician Registration';
         *   const disableResult = await caspio.apps.dpDisableByNames(APP_NAME, DP_NAME);
         *   console.log(disableResult);
         *   return disableResult;
         * }
         *
         * dpDisable();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "DataPage 'Physician Registration' has been successfully disabled."
         * }
         */
        dpDisableByNames: async (appName, dataPageName) => {
          const keyReq = await _utils.appAndDataPageKeysGivenNames(appName, dataPageName);

          if (keyReq) {
            try {
              const [externalKey, appKey] = keyReq;
              const theReq = await axios({
                method: 'delete',
                url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}/deployment`,
                headers: caspioHeaders,
              });
              const { status, statusText } = theReq;
              const message = `DataPage '${dataPageName}' has been successfully disabled.`;
              const responseObj = { status, statusText, message };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Disable a DataPage by specifying the ID of the application to which the DataPage is linked (i.e., `externalKey`) as well as specifying the ID of the DataPage itself (i.e., `appKey`).
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @param {string} appKey DataPage ID
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the disable attempt (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // disable the 'Physician Registration' DataPage which is part of the
         * // 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDeploy() {
         *   const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const DP_ID = '409550008f83dc4dd4554a07b7bf';
         *   const deployResult = await caspio.apps.dpDeployByKeys(APP_ID, DP_ID);
         *   console.log(deployResult);
         *   return deployResult;
         * }
         *
         * dpDeploy();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: 'DataPage successfully disabled.'
         * }
         */
        dpDisableByKeys: async (externalKey, appKey) => {
          try {
            const theReq = await axios({
              method: 'delete',
              url: `${baseURL}/v2/applications/${externalKey}/datapages/${appKey}/deployment`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = 'DataPage successfully disabled.';
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Deploys all DataPages in an application where the application is specified by its case-insensitive name (i.e., `appName`).
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted deployment of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // deploy all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDeployAll() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const deployResult = await caspio.apps.dpDeployAllByAppName(APP_NAME);
         *   console.log(deployResult);
         *   return deployResult;
         * }
         *
         * dpDeployAll();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "All DataPages in application 'Demo - Physician Directory - Caspio SDK' have been successfully deployed."
         * }
         */
        dpDeployAllByAppName: async (appName) => {
          const externalKey = await _utils.appKeyGivenAppName(appName);

          if (externalKey) {
            try {
              const theReq = await axios({
                method: 'put',
                url: `${baseURL}/v2/applications/${externalKey}/datapages/deployment`,
                headers: caspioHeaders,
              });
              const { status, statusText } = theReq;
              const message = `All DataPages in application '${appName}' have been successfully deployed.`;
              const responseObj = { status, statusText, message };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Deploys all DataPages in an application where the application is specified by its ID (i.e., `externalKey`).
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted deployment of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // deploy all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDeployAll() {
         *   const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const deployResult = await caspio.apps.dpDeployAllByAppKey(APP_ID);
         *   console.log(deployResult);
         *   return deployResult;
         * }
         *
         * dpDeployAll();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: 'All DataPages in the specified application have been successfully deployed.'
         * }
         */
        dpDeployAllByAppKey: async (externalKey) => {
          try {
            const theReq = await axios({
              method: 'put',
              url: `${baseURL}/v2/applications/${externalKey}/datapages/deployment`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = 'All DataPages in the specified application have been successfully deployed.';
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Disables all DataPages in an application where the application is specified by its case-insensitive name (i.e., `appName`).
         *
         * @memberOf Applications
         * @param {string} appName Name of the application (case-insensitive)
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted disabling of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // disable all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDisableAll() {
         *   const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
         *   const disableResult = await caspio.apps.dpDisableAllByAppName(APP_NAME);
         *   console.log(disableResult);
         *   return disableResult;
         * }
         *
         * dpDisableAll();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "All DataPages in application 'Demo - Physician Directory - Caspio SDK' have been successfully disabled."
         * }
         */
        dpDisableAllByAppName: async (appName) => {
          const externalKey = await _utils.appKeyGivenAppName(appName);

          if (externalKey) {
            try {
              const theReq = await axios({
                method: 'delete',
                url: `${baseURL}/v2/applications/${externalKey}/datapages/deployment`,
                headers: caspioHeaders,
              });
              const { status, statusText } = theReq;
              const message = `All DataPages in application '${appName}' have been successfully disabled.`;
              const responseObj = { status, statusText, message };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Disables all DataPages in an application where the application is specified by its ID (i.e., `externalKey`).
         *
         * @memberOf Applications
         * @param {string} externalKey Application ID
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted disabling of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // disable all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function dpDisableAll() {
         *   const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
         *   const disableResult = await caspio.apps.dpDisableAllByAppKey(APP_ID);
         *   console.log(disableResult);
         *   return disableResult;
         * }
         *
         * dpDisableAll();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: 'All DataPages in the specified application have been successfully disabled.'
         * }
         */
        dpDisableAllByAppKey: async (externalKey) => {
          try {
            const theReq = await axios({
              method: 'delete',
              url: `${baseURL}/v2/applications/${externalKey}/datapages/deployment`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = 'All DataPages in the specified application have been successfully disabled.';
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
      },
      /**
       * Methods for tables.
       *
       * @namespace Tables
       */
      tables: {
        /**
         * Returns an array of strings where each string represents an available table for a Caspio account.
         *
         * @memberOf Tables
         * @returns {Promise<Array<string>>} Array of strings representing table names for a Caspio account
         * @since 1.0.0
         * @example
         * // get list of all table names linked to a Caspio account
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getTableNames() {
         *   const tableNames = await caspio.tables.listing();
         *   console.log(tableNames);
         *   return tableNames;
         * }
         *
         * getTableNames();
         *
         * // sample return value
         * [
         *   ...,
         *   'Demo_Physicians',
         *   ...
         * ]
         */
        listing: async () => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/tables`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Creates a new table using the name and field definitions provided (i.e., `tableName` and `fieldDefinitions`, respectively). This is often a *slow* method and takes a while for the request to be processed by Caspio's servers.
         *
         * **Note (incompatible types):** Some properties are not compatible with some field types. For example, it is not possible to specify a `Prefix` for a field whose `Type` is `'TIMESTAMP'`. Use care and caution when creating field definitions. The example that accompanies this method shows examples of each field `Type` creation.
         *
         * @see Caspio documentation for [creating tables](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/)
         * @memberOf Tables
         * @param {string} tableName Name of the table
         * @param {Array.<Object>} fieldDefinitions Definitions of the fields to be created in the new table
         * @param {string} fieldDefinitions[].Name The name of the field to be created. Field names must comply with the following naming protocol as specified in [Caspio's documentation](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/):
         *
         * Must be alphanumeric (`a-Z`, `0-9`); can be up to `32` characters long;
         *
         * may include an underscore (`_`);
         *
         * must begin with a letter; spaces are not allowed
         * @param {string} fieldDefinitions[].Type The data type of the field to be created. Valid types: `'AUTONUMBER'`, `'PREFIXED AUTONUMBER'`, `'GUID'`, `'RANDOM ID'`, `'STRING'`, `'TEXT'`, `'PASSWORD'`, `'NUMBER'`, `'INTEGER'`, `'CURRENCY'`, `'DATE/TIME'`, `'YES/NO'`, `'FILE'`, `'TIMESTAMP'`, `'LIST-STRING'`, `'LIST-NUMBER'`, `LIST-DATE/TIME'`
         * @param {boolean} [fieldDefinitions[].Unique] Determines whether or not uniqueness should be enforced on values entered in the field
         * @param {boolean} [fieldDefinitions[].UniqueAllowNulls] Determines whether or not missing values should be allowed in a field where uniqueness is enforced
         * @param {string} [fieldDefinitions[].Label] A label for the field that will be automatically used in DataPages (maximum of `255` characters allowed)
         * @param {string} [fieldDefinitions[].Description] Description of the field (maximum of `4000` characters allowed)
         * @param {number} [fieldDefinitions[].DisplayOrder] Order in which the field is displayed in a table
         * @param {boolean} [fieldDefinitions[].OnInsert] Determines whether or not a timestamp should record when (i.e., date and time) a record was inserted in a table (defaults to `true` when the field `Type` is `'TIMESTAMP'`)
         * @param {boolean} [fieldDefinitions[].OnUpdate] Determines whether or not a timestamp should record when (i.e., date and time) a record was updated in a table (defaults to `false` when the field `Type` is `'TIMESTAMP'`)
         * @param {string} [fieldDefinitions[].TimeZone] Time zone description for a field with `Type` of `'TIMESTAMP'` (to see all valid time zone descriptions, visit the design page for any table in your application, select the data type of "Timestamp" for the field, and then view the "Time Zone" selection list in the "Options" menu on the right of the table design page)
         * @param {string} [fieldDefinitions[].Format] Number format for fields with a `Type` of `'PREFIXED AUTONUMBER'`. Possible values for `Format` option: `'1'`, `'01'`, `'001'`, `'0001'`, `'00001'`, `'000001'`, `'0000001'`
         * @param {string} [fieldDefinitions[].Prefix] Prefix for values in a field with a `Type` of either `'PREFIXED AUTONUMBER'` or `'RANDOM ID'`.
         * @param {number} [fieldDefinitions[].Length] Length of random character generation when using a field with a `Type` of `'RANDOM ID'`. The length of a field value recorded may exceed the `Length` specified if a `Prefix` has been provided (i.e., the `Prefix` *does not* count toward the overall length of the random character string generated). Valid values for the `Length` option: `6`, `7`, `8`, `9`, `10`, `11`, `12`
         * @param {boolean} [fieldDefinitions[].IsFormula] Indicates whether or not the field is being used as a formula field. Currently, the Caspio REST API does not enable you to actually specify the formula to be used. The use of this option when creating a field for a table is *not* recommended.
         * @param {Array} [fieldDefinitions[].ListField] Array that specifies the list values to be used when the field has a `Type` of `LIST-STRING`, `LIST-NUMBER`, or `LIST-DATE/TIME'`. All values specified in the array should have a data type corresponding to `<data-type>` in `LIST-<data-type>` (i.e., `STRING`, `NUMBER`, or `DATE/TIME`).
         *
         * For example, values for a field with a `Type` of `'LIST-STRING'` may be specified as `[ "2022-25-12", "Dog", "2022", ... ]`, a `'LIST-NUMBER'` as `[ 15, 21, ... ]`, and a `'LIST-DATE/TIME'` as `[ "1991-07-30T15:32:57", "2019-01-20", "2020-06-08T00:00:00", ... ]`.
         *
         * If you were to then query the definition of the table to which the fields above were added, then the `ListField` property for the `'LIST-STRING'` would appear as `{ "1": "2022-25-12", "2": "Dog", "3": "2022", ... }`, the `'LIST-NUMBER'` as `{ "1": 15, "2": 21, ... }`, and the `'LIST-DATE/TIME'` as `{ "1": "1991-07-30T15:32:57", "2": "2019-01-20T00:00:00", "3": "2020-06-08T00:00:00", ... }`.
         *
         * @returns {Promise<{status: 201, statusText: 'Created', message: string}>} Object with information about the attempted creation of the specified table (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // create a table titled 'my_new_table' that includes an example
         * // of the creation of each field type that Caspio has to offer
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function createTable() {
         *   const tableName = 'my_new_table';
         *   const tableColumnDefs = [
         *     {
         *       "Name": "my_id",
         *       "Type": "AUTONUMBER",
         *       "Unique": true,
         *       "Description": "Data Type: Autonumber\n\nDescription: An automatically-assigned ID field. The value is incremented by 1 for each new record and cannot be changed except by resetting it for the entire table.\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000), Number, Integer, Currency",
         *       "DisplayOrder": 1,
         *       "Label": "Example field with Type of AUTONUMBER",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Format": "001",
         *       "Prefix": "some_prefix",
         *       "Name": "my_prefixed_autonumber",
         *       "Type": "PREFIXED AUTONUMBER",
         *       "Unique": true,
         *       "Description": "Data Type: Prefixed Autonumber\n\nDescription: An automatically-assigned ID field with the ability to add a prefix.\n\nUse the Options area to configure the prefix and number format of the ID code to be generated.\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000)",
         *       "DisplayOrder": 2,
         *       "Label": "Example field with Type of PREFIXED AUTONUMBER",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "guid",
         *       "Type": "GUID",
         *       "Unique": true,
         *       "Description": "Data Type: GUID\n\nDescription: A system-generated and globally-unique identifier value, typically used as a complex unique value.\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000)",
         *       "DisplayOrder": 3,
         *       "Label": "Type GUID",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Format": "0U",
         *       "Prefix": "",
         *       "Length": 8,
         *       "Name": "random_id",
         *       "Type": "RANDOM ID",
         *       "Unique": true,
         *       "Description": "Data Type: Random ID\n\nDescription: A unique system-generated random ID field with the ability to add a prefix as well as define the length and composition of characters, digits, or both.\n\nUse the Options area to configure the prefix and number of characters the ID code should contain. You can also specify whether to include alphabet characters only, numbers only, or both (alphanumeric).\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000)",
         *       "DisplayOrder": 4,
         *       "Label": "Type: RANDOM ID",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Full_Name",
         *       "Type": "STRING",
         *       "Unique": false,
         *       "Description": "Data Type: Text (255)\n\nDescription: Used for a string of text of up to 255 alphanumeric characters and/or symbols. This data type is the most common data type and yields the fastest performance in searches.\n\nYou can also use this data type for numeric characters that are not used as numbers in calculations or formatting--such as phone numbers, zip codes, and social security numbers. Not doing so impacts formatting and prevents proper sorting by this field.\n\nExamples: First_Name, State, Phone, Zip_Code\n\nConversion Compatibility: Text (64000), File (provided that the text field contains proper file paths)",
         *       "DisplayOrder": 5,
         *       "Label": "Type: TEXT",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Bio",
         *       "Type": "TEXT",
         *       "Unique": false,
         *       "Description": "Data Type: Text (64000)\n\nDescription: Used for a long string of text of up to 64,000 alphanumeric characters and/or symbols.\n\nUse this data type for description fields or other lengthy text data. Otherwise, use Text (255), which performs much faster.\n\nExamples: Description, Comments\n\nConversion Compatibility: Text (255) (longer strings are truncated), File (provided that the text field contains proper file paths)",
         *       "DisplayOrder": 6,
         *       "Label": "Type: STRING",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "password",
         *       "Type": "PASSWORD",
         *       "Unique": false,
         *       "Description": "Data Type: Password\n\nDescription: Used for storing user passwords.\n\nThe value of this field is always encrypted and cannot be seen in Datasheet or DataPages.\n\nExamples: Password\n\nConversion Compatibility: None",
         *       "DisplayOrder": 7,
         *       "Label": "Type: PASSWORD",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Favorite_Number",
         *       "Type": "NUMBER",
         *       "Unique": false,
         *       "Description": "Data Type: Number\n\nDescription: Used for decimal numbers.\n\nExamples: Weight, height, area, percentage values\n\nConversion Compatibility: Text (255), Text (64000), Integer (decimal values are truncated), Currency (allows up to four decimal points)",
         *       "DisplayOrder": 8,
         *       "Label": "Type: NUMBER",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Age",
         *       "Type": "INTEGER",
         *       "Unique": false,
         *       "Description": "Data Type: Integer\n\nDescription: Used for numbers that do not have a decimal point, can be used as IDs and in relationships.\n\nExamples: Age, number of children\n\nConversion Compatibility: Text (255), Text (64000), Number, Currency",
         *       "DisplayOrder": 9,
         *       "Label": "Type: INTEGER",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Salary",
         *       "Type": "CURRENCY",
         *       "Unique": false,
         *       "Description": "Data Type: Currency\n\nDescription: Used for money fields in any currency.\n\nExamples: Price, Salary\n\nConversion Compatibility: Text (255), Text (64000), Integer (decimal values are truncated)",
         *       "DisplayOrder": 10,
         *       "Label": "Type: CURRENCY",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Birthday",
         *       "Type": "DATE/TIME",
         *       "Unique": false,
         *       "Description": "Data Type: Date/Time\n\nDescription: Used for date and time data.\n\nDataPages automatically display a calendar picker for date/time fields. 'Precision' is specified in the DataPage and is used to configure which part of the date or time part is used.\n\nUse the Options area to specify whether or not to allow blank values in this field.\n\nExamples: Followup_Date, Date_of_Birth\n\nConversion Compatibility: Text (255), Text (64000), Timestamp",
         *       "DisplayOrder": 11,
         *       "Label": "Type: DATE/TIME",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Married",
         *       "Type": "YES/NO",
         *       "Unique": false,
         *       "Description": "Data Type: Yes/No\n\nDescription: Used for fields that allow only two possible values: yes or no (true or false).\n\nBy default a Yes/No input field appears as a checkbox in forms.\n\nExamples: Active_User, Requested_Newsletter, Published\n\nConversion Compatibility: Text (255), Text (64000), Number",
         *       "DisplayOrder": 12,
         *       "Label": "YES/NO",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Profile_Picture",
         *       "Type": "FILE",
         *       "Unique": false,
         *       "Description": "Data Type: File\n\nDescription: Used to associate files with a record.\n\nFile fields allow your app users to upload files using a web form. Files are stored in your database and can be used in DataPages.\n\nFiles can also be accessed in the Files area of All Assets, organized in a file folder structure.\n\nExamples: Profile_Photo, Resume, Contract\n\nConversion Compatibility: Text (255) may be truncated, Text (64000)",
         *       "DisplayOrder": 13,
         *       "Label": "FILE",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "OnInsert": true,
         *       "OnUpdate": false,
         *       "TimeZone": "UTC",
         *       "Name": "timestamp",
         *       "Type": "TIMESTAMP",
         *       "Unique": false,
         *       "Description": "Data Type: Timestamp\n\nDescription: A timestamp is a type of smart field that automatically records the date and time when a record is submitted and/or updated.\n\nUse the Options area to configure the time zone and the general behavior of the timestamp.\n\nExamples: Date_Submitted, Date_Updated\n\nConversion Compatibility: Text (255), Text (64000), Date/Time",
         *       "DisplayOrder": 14,
         *       "Label": "Type: TIMESTAMP",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false
         *     },
         *     {
         *       "Name": "Favorite_Words",
         *       "Type": "LIST-STRING",
         *       "Unique": false,
         *       "Description": "Data Type: List\n\nDescription: A special data type for storing a collection of strings, numbers or dates in a single field. (List - String for text values of up to 255 characters.)\n\nExamples: Allergies, Pizza_Toppings\n\nConversion Compatibility: None",
         *       "DisplayOrder": 15,
         *       "Label": "LIST-STRING",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false,
         *       "ListField": ["25", "Coffee", "Doggo", "Goober", "Jolly", "Malapropism"]
         *     },
         *     {
         *       "Name": "Favorite_Numbers",
         *       "Type": "LIST-NUMBER",
         *       "Unique": false,
         *       "Description": "Data Type: tbd\n\nDescription: A special data type for storing a collection of strings, numbers or dates in a single field. (List - Number for numeric values of up to 15 digits.)\n\nExamples: Allergies, Pizza_Toppings\n\nConversion Compatibility: None",
         *       "DisplayOrder": 16,
         *       "Label": "LIST-NUMBER",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false,
         *       "ListField": [18, 42, 91, 777, 89]
         *     },
         *     {
         *       "Name": "Favorite_Dates",
         *       "Type": "LIST-DATE/TIME",
         *       "Unique": false,
         *       "Description": "Data Type: tbd\n\nDescription: A special data type for storing a collection of strings, numbers or dates in a single field. (List - Date for date or date/time values.)\n\nExamples: Allergies, Pizza_Toppings\n\nConversion Compatibility: None",
         *       "DisplayOrder": 17,
         *       "Label": "LIST-DATE/TIME",
         *       "UniqueAllowNulls": false,
         *       "IsFormula": false,
         *       "ListField": ["1991-07-30T15:32:57", "2019-01-20T00:00:00", "2020-06-08T00:00:00", "2021-02-02T00:00:00"]
         *     }
         *   ]
         *
         *   const creationResult = await caspio.tables.create(tableName, tableColumnDefs);
         *   console.log(creationResult);
         *   return creationResult;
         * }
         *
         * createTable();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: "Table 'my_new_table' has been created successfully."
         * }
         */
        create: async (tableName, fieldDefinitions) => {
          try {
            const theReq = await axios({
              method: 'post',
              url: `${baseURL}/v2/tables`,
              headers: caspioHeaders,
              data: {
                Name: tableName,
                Columns: fieldDefinitions,
              },
            });
            const { status, statusText } = theReq;
            const message = `Table '${tableName}' has been created successfully.`;
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns the description of the table (i.e., a description of table `tableName`).
         *
         * @memberOf Tables
         * @param {string} tableName Name of the table (case-insensitive)
         * @returns {Promise<{Name: string, Note: string}>} Object with the name of the table (i.e., `Name`) and a note about the table (i.e., `Note`)
         * @since 1.0.0
         * @example
         * // get the description of the 'Demo_Users' table
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getTableDescription() {
         *   const description = await caspio.tables.description('Demo_Users');
         *   console.log(description);
         *   return description;
         * }
         *
         * getTableDescription();
         *
         * // sample return value
         * { Name: 'Demo_Users', Note: '' }
         */
        description: async (tableName) => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/tables/${tableName}`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns the definition of table `tableName` as an array of field definitions (objects).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @returns {Promise<Array<{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}>>} Array of field definitions (objects) where the properties of the objects depend on the field definition (e.g., a field with `Type` of `'RANDOM ID'` may have a `Length` property as part of the field definition object whereas other fields would not)
         * @since 1.0.0
         * @example
         * // get the table definition of the 'Demo_Users' table
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getTableDefinition() {
         *   const definition = await caspio.tables.definition('Demo_Users');
         *   console.log(definition);
         *   return definition;
         * }
         *
         * getTableDefinition();
         *
         * // sample return value
         * [
         *   {
         *     Format: '0U',
         *     Prefix: '',
         *     Length: 8,
         *     Name: 'User_ID',
         *     Type: 'RANDOM ID',
         *     Unique: true,
         *     Description: '',
         *     DisplayOrder: 1,
         *     Label: '',
         *     UniqueAllowNulls: false,
         *     IsFormula: false
         *   },
         *   {
         *     Name: 'Name',
         *     Type: 'STRING',
         *     Unique: false,
         *     Description: '',
         *     DisplayOrder: 2,
         *     Label: '',
         *     UniqueAllowNulls: false,
         *     IsFormula: false
         *   },
         *   {
         *     Name: 'Email',
         *     Type: 'STRING',
         *     Unique: true,
         *     Description: '',
         *     DisplayOrder: 3,
         *     Label: '',
         *     UniqueAllowNulls: false,
         *     IsFormula: false
         *   },
         *   {
         *     Name: 'Password',
         *     Type: 'PASSWORD',
         *     Unique: false,
         *     Description: '',
         *     DisplayOrder: 4,
         *     Label: '',
         *     UniqueAllowNulls: false,
         *     IsFormula: false
         *   },
         *   {
         *     Name: 'Role',
         *     Type: 'STRING',
         *     Unique: false,
         *     Description: '',
         *     DisplayOrder: 5,
         *     Label: '',
         *     UniqueAllowNulls: false,
         *     IsFormula: false
         *   },
         *   {
         *     Name: 'Active',
         *     Type: 'YES/NO',
         *     Unique: false,
         *     Description: '',
         *     DisplayOrder: 6,
         *     Label: '',
         *     UniqueAllowNulls: false,
         *     IsFormula: false
         *   }
         * ]
         */
        definition: async (tableName) => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/tables/${tableName}/fields`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Adds a field to table `tableName`.
         *
         * **Note (incompatible types):** Some properties are not compatible with some field types. For example, it is not possible to specify a `Prefix` for a field whose `Type` is `'TIMESTAMP'`. Use care and caution when creating field definitions.
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {Object} fieldToAdd Definition of field to add to the specified table
         * @param {string} fieldToAdd.Name The name of the field to be created. Field names must comply with the following naming protocol as specified in [Caspio's documentation](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/):
         *
         * Must be alphanumeric (`a-Z`, `0-9`);
         *
         * can be up to `32` characters long; may include an underscore (`_`);
         *
         * must begin with a letter; spaces are not allowed
         * @param {string} fieldToAdd.Type The type of the field to be created (i.e., data type). Valid types: `'AUTONUMBER'`, `'PREFIXED AUTONUMBER'`, `'GUID'`, `'RANDOM ID'`, `'STRING'`, `'TEXT'`, `'PASSWORD'`, `'NUMBER'`, `'INTEGER'`, `'CURRENCY'`, `'DATE/TIME'`, `'YES/NO'`, `'FILE'`, `'TIMESTAMP'`, `'LIST-STRING'`, `'LIST-NUMBER'`, `LIST-DATE/TIME'`
         * @param {boolean} [fieldToAdd.Unique] Determines whether or not uniqueness should be enforced on values entered in the field
         * @param {boolean} [fieldToAdd.UniqueAllowNulls] Determines whether or not missing values should be allowed in a field where uniqueness is enforced
         * @param {string} [fieldToAdd.Label] A label for the field that will be automatically used in DataPages (maximum of `255` characters allowed)
         * @param {string} [fieldToAdd.Description] Description of the field (maximum of `4000` characters allowed)
         * @param {number} [fieldToAdd.DisplayOrder] Order in which the field is displayed in a table
         * @param {boolean} [fieldToAdd.OnInsert] Determines whether or not a timestamp should record when (i.e., date and time) a record was inserted in a table (defaults to `true` when the field `Type` is `'TIMESTAMP'`)
         * @param {boolean} [fieldToAdd.OnUpdate] Determines whether or not a timestamp should record when (i.e., date and time) a record was updated in a table (defaults to `false` when the field `Type` is `'TIMESTAMP'`)
         * @param {string} [fieldToAdd.TimeZone] Time zone description for a field with `Type` of `'TIMESTAMP'` (to see all valid time zone descriptions, visit the design page for any table in your application, select the data type of "Timestamp" for the field, and then view the "Time Zone" selection list in the "Options" menu on the right of the table design page)
         * @param {string} [fieldToAdd.Format] Number format for fields with a `Type` of `'PREFIXED AUTONUMBER'`. Possible values for `Format` option: `'1'`, `'01'`, `'001'`, `'0001'`, `'00001'`, `'000001'`, `'0000001'`
         * @param {string} [fieldToAdd.Prefix] Prefix for values in a field with a `Type` of either `'PREFIXED AUTONUMBER'` or `'RANDOM ID'`.
         * @param {number} [fieldToAdd.Length] Length of random character generation when using a field with a `Type` of `'RANDOM ID'`. The length of a field value recorded may exceed the `Length` specified if a `Prefix` has been provided (i.e., the `Prefix` *does not* count toward the overall length of the random character string generated). Valid values for the `Length` option: `6`, `7`, `8`, `9`, `10`, `11`, `12`
         * @param {boolean} [fieldToAdd.IsFormula] Indicates whether or not the field is being used as a formula field. Currently, the Caspio REST API does not enable you to actually specify the formula to be used. The use of this option when creating a field for a table is *not* recommended.
         * @param {Array} [fieldToAdd.ListField] Array that specifies the list values to be used when the field has a `Type` of `LIST-STRING`, `LIST-NUMBER`, or `LIST-DATE/TIME'`. All values specified in the array should have a data type corresponding to `<data-type>` in `LIST-<data-type>` (i.e., `STRING`, `NUMBER`, or `DATE/TIME`).
         *
         * For example, values for a field with a `Type` of `'LIST-STRING'` may be specified as `[ "2022-25-12", "Dog", "2022", ... ]`, a `'LIST-NUMBER'` as `[ 15, 21, ... ]`, and a `'LIST-DATE/TIME'` as `[ "1991-07-30T15:32:57", "2019-01-20", "2020-06-08T00:00:00", ... ]`.
         *
         * If you were to then query the definition of the table to which the fields above were added, then the `ListField` property for the `'LIST-STRING'` would appear as `{ "1": "2022-25-12", "2": "Dog", "3": "2022", ... }`, the `'LIST-NUMBER'` as `{ "1": 15, "2": 21, ... }`, and the `'LIST-DATE/TIME'` as `{ "1": "1991-07-30T15:32:57", "2": "2019-01-20T00:00:00", "3": "2020-06-08T00:00:00", ... }`.
         *
         * @returns {Promise<{status: 201, statusText: 'Created', message: string}>} Object with information about the attempted creation of the new field for the specified table (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // add a simple text field (max 255 characters) to the 'Demo_Users' table
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function addFieldToTable() {
         *   const fieldDef = {
         *     "Name": "Sample_Field",
         *     "Type": "STRING",
         *     "Unique": false,
         *     "Description": "Sample data field to collext smaller textual data (max 255 characters)",
         *     "DisplayOrder": 1,
         *     "Label": "Sample Field",
         *   }
         *   const addFieldResult = await caspio.tables.addField('Demo_Users', fieldDef);
         *   console.log(addFieldResult);
         *   return addFieldResult;
         * }
         *
         * addFieldToTable();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: "The field 'Sample_Field' was successfully added to the following table: 'Demo_Users'."
         * }
         */
        addField: async (tableName, fieldToAdd) => {
          try {
            const theReq = await axios({
              method: 'post',
              url: `${baseURL}/v2/tables/${tableName}/fields`,
              headers: caspioHeaders,
              data: fieldToAdd,
            });
            const { status, statusText } = theReq;
            const message = `The field '${fieldToAdd.Name}' was successfully added to the following table: '${tableName}'.`;
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns the definition of field `fieldName` from table `tableName`.
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @returns {Promise<{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}>} Field definition (object) where the properties of the object depend on the field definition (e.g., a field with `Type` of `'RANDOM ID'` may have a `Length` property as part of the field definition object whereas other fields would not)
         * @since 1.0.0
         * @example
         * // get the definition of the field 'Sample_Field' from the 'Demo_Users' table
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getFieldDef() {
         *   const fieldDef = await caspio.tables.fieldDefinition('Demo_Users', 'Sample_Field');
         *   console.log(fieldDef);
         *   return fieldDef;
         * }
         *
         * getFieldDef();
         *
         * // sample return value
         * {
         *   Name: 'Sample_Field',
         *   Type: 'STRING',
         *   Unique: false,
         *   Description: 'Sample data field to collext smaller textual data (max 255 characters)',
         *   DisplayOrder: 1,
         *   Label: 'Sample Field',
         *   UniqueAllowNulls: false,
         *   IsFormula: false
         * }
         */
        fieldDefinition: async (tableName, fieldName) => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/tables/${tableName}/fields/${fieldName}`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Updates field `fieldName` of table `tableName` using properties and values of the `updatedFieldDef` object.
         *
         * **Note 1 (importance of `New` prefix):** It is critically important that *all* updated field properties be prepended with `New` in the provided `updatedFieldDef` object; otherwise, an error will be thrown. For example, if you want to update the `Type` of a field from `'STRING'` to `'TEXT'`, then you need to specify the `updatedFieldDef` object as `{ ..., 'NewType': 'TEXT', ... }` as opposed to `{ ..., 'Type': 'TEXT', ... }`. The presence of `'New'` is required.
         *
         * **Note 2 (warning about list types):** Be wary of updating a field with a `Type` of `LIST-STRING|NUMBER|DATE/TIME` for reasons outlined in this method's documentation.
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} fieldName Name of field (case-sensitive)
         * @param {Object} updatedFieldDef Definition of field to update in table `tableName` (note again the importance of prepending field properties with `New` such as `'NewType'`, `'NewUnique'`, etc.).
         * @param {string} [updatedFieldDef.NewName] The name of the field to be created. Field names must comply with the following naming protocol as specified in [Caspio's documentation](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/):
         *
         * Must be alphanumeric (`a-Z`, `0-9`);
         *
         * can be up to `32` characters long; may include an underscore (`_`);
         *
         * must begin with a letter; spaces are not allowed
         * @param {string} [updatedFieldDef.NewType] The type of the field to be created (i.e., data type). Valid types: `'AUTONUMBER'`, `'PREFIXED AUTONUMBER'`, `'GUID'`, `'RANDOM ID'`, `'STRING'`, `'TEXT'`, `'PASSWORD'`, `'NUMBER'`, `'INTEGER'`, `'CURRENCY'`, `'DATE/TIME'`, `'YES/NO'`, `'FILE'`, `'TIMESTAMP'`, `'LIST-STRING'`, `'LIST-NUMBER'`, `LIST-DATE/TIME'`
         * @param {boolean} [updatedFieldDef.NewUnique] Determines whether or not uniqueness should be enforced on values entered in the field
         * @param {boolean} [updatedFieldDef.NewUniqueAllowNulls] Determines whether or not missing values should be allowed in a field where uniqueness is enforced
         * @param {string} [updatedFieldDef.NewLabel] A label for the field that will be automatically used in DataPages (maximum of `255` characters allowed)
         * @param {string} [updatedFieldDef.NewDescription] Description of the field (maximum of `4000` characters allowed)
         * @param {number} [updatedFieldDef.NewDisplayOrder] Order in which the field is displayed in a table
         * @param {boolean} [updatedFieldDef.NewOnInsert] Determines whether or not a timestamp should record when (i.e., date and time) a record was inserted in a table (defaults to `true` when the field `Type` is `'TIMESTAMP'`)
         * @param {boolean} [updatedFieldDef.NewOnUpdate] Determines whether or not a timestamp should record when (i.e., date and time) a record was updated in a table (defaults to `false` when the field `Type` is `'TIMESTAMP'`)
         * @param {string} [updatedFieldDef.NewTimeZone] Time zone description for a field with `Type` of `'TIMESTAMP'` (to see all valid time zone descriptions, visit the design page for any table in your application, select the data type of "Timestamp" for the field, and then view the "Time Zone" selection list in the "Options" menu on the right of the table design page)
         * @param {string} [updatedFieldDef.NewFormat] Number format for fields with a `Type` of `'PREFIXED AUTONUMBER'`. Possible values for `Format` option: `'1'`, `'01'`, `'001'`, `'0001'`, `'00001'`, `'000001'`, `'0000001'`
         * @param {string} [updatedFieldDef.NewPrefix] Prefix for values in a field with a `Type` of either `'PREFIXED AUTONUMBER'` or `'RANDOM ID'`.
         * @param {number} [updatedFieldDef.NewLength] Length of random character generation when using a field with a `Type` of `'RANDOM ID'`. The length of a field value recorded may exceed the `Length` specified if a `Prefix` has been provided (i.e., the `Prefix` *does not* count toward the overall length of the random character string generated). Valid values for the `Length` option: `6`, `7`, `8`, `9`, `10`, `11`, `12`
         * @param {Array} [updatedFieldDef.NewListField] Array that specifies the list values to be used when the field has a `Type` of `LIST-STRING`, `LIST-NUMBER`, or `LIST-DATE/TIME'`. All values specified in the array should have a data type corresponding to `<data-type>` in `LIST-<data-type>` (i.e., `STRING`, `NUMBER`, or `DATE/TIME`). Note that the values specified in the update will effectively *remove* the previous values.
         *
         * For example, values for a field with a `Type` of `'LIST-STRING'` may be specified as `[ "2022-25-12", "Dog", "2022", ... ]`, a `'LIST-NUMBER'` as `[ 15, 21, ... ]`, and a `'LIST-DATE/TIME'` as `[ "1991-07-30T15:32:57", "2019-01-20", "2020-06-08T00:00:00", ... ]`.
         *
         * If you were to then query the definition of the table to which the fields above were added, then the `ListField` property for the `'LIST-STRING'` would appear as `{ "num1": "2022-25-12", "num2": "Dog", "num3": "2022", ... }`, the `'LIST-NUMBER'` as `{ "num1": 15, "num2": 21, ... }`, and the `'LIST-DATE/TIME'` as `{ "num1": "1991-07-30T15:32:57", "num2": "2019-01-20T00:00:00", "num3": "2020-06-08T00:00:00", ... }`, where all of the `num` values depend on what the previous definition was of the `ListField`.
         *
         * **Note:** The definition for an updated `ListField` is a bit wonky, and how the object keys are created for the new definition depends on the following three possibilities concerning each element as specified in the `NewListField` array:
         * - element currently exists in `ListField`: Nothing happens.
         * - element does not exist in `ListField` but did at some point in the past: The original key-value pair is effectively *restored*; that is, if the current `ListField` definition is `{ "1": "Cat", "4": "Frog", "6": "Mouse" }` but included the key-value pair `"2": "Dog"` at some point in the past, then specifying `NewListField` as `[ "Cat", "Dog", "Frog" ]` will result in a new `ListField` definition of `{ "1": "Cat", "2": "Dog", "4": "Frog" }`. The key-value pair `"2": "Dog"` is effectively *restored*.
         * - element does not exist in `ListField` and never has: A completely *new* key-value pair is created, where the numeric value of the key will be the highest possible value that is next in sequence; that is, if `[ "Cat", "Dog", "Frog" ]` was the array originally specified for `ListField`, with corresponding definition `{ "1": "Cat", "2": "Dog", "3": "Frog" }`, then specifying `NewListField` as `[ "Dog", "Cow" ]` would result in the following `ListField` definition: `{ "2": "Dog", "4": "Cow" }`.
         *
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted update of the specified field for the specified table (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // update the field 'Sample_Field' in table 'Demo_Users'
         * // to have a Type of 'TEXT' instead of 'STRING'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function updateTableField() {
         *   const updatedFieldDef = {
         *     "NewType": "TEXT"
         *   }
         *   const updateResult = await caspio.tables.updateFieldDefinition('Demo_Users', 'Sample_Field', updatedFieldDef);
         *   console.log(updateResult);
         * }
         *
         * updateTableField();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "The field 'Sample_Field' in table 'Demo_Users' was successfully updated."
         * }
         */
        updateFieldDefinition: async (tableName, fieldName, updatedFieldDef) => {
          try {
            const theReq = await axios({
              method: 'put',
              url: `${baseURL}/v2/tables/${tableName}/fields/${fieldName}`,
              headers: caspioHeaders,
              data: updatedFieldDef,
            });
            const { status, statusText } = theReq;
            const message = `The field '${fieldName}' in table '${tableName}' was successfully updated.`;
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Deletes field `fieldName` from table `tableName` (this may not be possible if other objects depend on this field such as triggered actions, authentications, etc.).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} fieldName Name of field (case-insensitive)
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about the attempted removal of the specified field from the specified table (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // remove the field 'Sample_Field' from table 'Demo_Users'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function deleteTableField() {
         *   const deleteResult = await caspio.tables.deleteField('Demo_Users', 'Sample_Field');
         *   console.log(deleteResult);
         *   return deleteResult;
         * }
         *
         * deleteTableField();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "The field 'Sample_Field' in table 'Demo_Users' was successfully deleted."
         * }
         */
        deleteField: async (tableName, fieldName) => {
          try {
            const theReq = await axios({
              method: 'delete',
              url: `${baseURL}/v2/tables/${tableName}/fields/${fieldName}`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = `The field '${fieldName}' in table '${tableName}' was successfully deleted.`;
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns a list of the names of all password fields in table `tableName` (i.e., an array of the names of whatever fields are present in table `tableName` that have a `Type` of `'PASSWORD'`).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @returns {Promise<Array<string>>} Array of strings representing the names of fields present in the specified table that have a `Type` of `'PASSWORD'`
         * @since 1.0.0
         * @example
         * // get list of all fields with a Type of 'PASSWORD' from the table 'Demo_Users'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getTablePasswordFields() {
         *   const passwordFields = await caspio.tables.passwordFields('Demo_Users');
         *   console.log(passwordFields);
         *   return passwordFields;
         * }
         *
         * getTablePasswordFields();
         *
         * // sample return value
         * [ 'Password' ]
         */
        passwordFields: async (tableName) => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/tables/${tableName}/passwordFields`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Updates the password field `passwordFieldName` in table `tableName` with a value of `newPasswordValue` for all records that are matched by the provided `WHERE` clause query (i.e., `whereClause`).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} passwordFieldName Name of field in table `tableName` with a `Type` of `'PASSWORD'` to target (case-insensitive)
         * @param {string} newPasswordValue New password value
         * @param {string} whereClause `WHERE` clause (i.e., query to match records to be affected)
         * @returns {Promise<{status: 200, statusText: 'OK', recordsAffected: number, message: string}>} Object with information about the attempted update of all password values for the matched records (i.e., `status`, `statusText`, `recordsAffected`, and `message`).
         * @since 1.0.0
         * @example
         * // update the value in field 'Password' of table 'Demo_Users'
         * // to 'myPassword!' for all records in table 'Demo_Users' that have
         * // an Email field value of 'Edd36@yahoo.com'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function updateTablePassword() {
         *   const whereClause = `Email = 'Edd36@yahoo.com'`;
         *   const updateResult = await caspio.tables.updatePasswordFieldValue('Demo_Users', 'Password', 'myPassword!', whereClause);
         *   console.log(updateResult);
         *   return updateResult;
         * }
         *
         * updateTablePassword();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   recordsAffected: 1,
         *   message: "Password value(s) successfully updated for field 'Password' in table 'Demo_Users' for 1 record(s)."
         * }
         */
        updatePasswordFieldValue: async (tableName, passwordFieldName, newPasswordValue, whereClause) => {
          const processedWhereClause = _utils.whereClauseBuilder(whereClause);
          if (typeof processedWhereClause === 'string') {
            try {
              const theReq = await axios({
                method: 'put',
                url: `${baseURL}/v2/tables/${tableName}/passwordFields/${passwordFieldName}?q.where=${processedWhereClause}`,
                headers: caspioHeaders,
                data: {
                  Value: newPasswordValue,
                },
              });
              const { status, statusText, data: { RecordsAffected: recordsAffected } } = theReq;
              const message = `Password value(s) successfully updated for field '${passwordFieldName}' in table '${tableName}' for ${recordsAffected} record(s).`;
              const responseObj = {
                status, statusText, recordsAffected, message,
              };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Resets (i.e., removes) the password value in field `passwordFieldName` of table `tableName` for all records that match the provided `WHERE` clause query (i.e., `whereClause`).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} passwordFieldName Name of field with `Type` of `'PASSWORD'` in table `tableName` to target (case-insensitive)
         * @param {string} whereClause `WHERE` clause (i.e., query to match records to be affected)
         * @returns {Promise<{status: 200, statusText: 'OK', recordsAffected: number, message: string}>} Object with information about the attempted resetting or removal of all password values for the matched records (i.e., `status`, `statusText`, `recordsAffected`, and `message`).
         * @since 1.0.0
         * @example
         * // removes the value in field 'Password' of table 'Demo_Users'
         * // for all records that have an Email field value of 'Edd36@yahoo.com'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function removePasswordValue() {
         *   const whereClause = `Email = 'Edd36@yahoo.com'`;
         *   const removeResult = await caspio.tables.deletePasswordFieldValue('Demo_Users', 'Password', whereClause);
         *   console.log(removeResult);
         *   return removeResult;
         * }
         *
         * removePasswordValue();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   recordsAffected: 1,
         *   message: "Password value(s) successfully reset (i.e., removed) for field 'Password' in table 'Demo_Users' for 1 record(s)."
         * }
         */
        deletePasswordFieldValue: async (tableName, passwordFieldName, whereClause) => {
          const processedWhereClause = _utils.whereClauseBuilder(whereClause);
          if (typeof processedWhereClause === 'string') {
            try {
              const theReq = await axios({
                method: 'delete',
                url: `${baseURL}/v2/tables/${tableName}/passwordFields/${passwordFieldName}?q.where=${processedWhereClause}`,
                headers: caspioHeaders,
              });
              const { status, statusText, data: { RecordsAffected: recordsAffected } } = theReq;
              const message = `Password value(s) successfully reset (i.e., removed) for field '${passwordFieldName}' in table '${tableName}' for ${recordsAffected} record(s).`;
              const responseObj = {
                status, statusText, recordsAffected, message,
              };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Returns records in a paginated fashion from table `tableName` that satisfy the provided query criteria (i.e., `selectionCriteriaObj`).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {Object} [selectionCriteriaObj={}] Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, `orderBy`, `limit`, `pageNumber`, and `pageSize`.
         *
         * In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on.
         *
         * **Note:** Usage of window functions (e.g., `ROW_NUMBER()`) when expecting more than `1000` records is problematic due to being rate-limited by Caspio's servers at 1000 records per request (hence there's not an effective window within which to operate).
         * @param {string} [selectionCriteriaObj.select='*'] List of fields separated by comma, where fields may either be fields directly from the specified table or could be a combination of numerous other things:
         *
         * aliases such as `First_Name AS name`;
         *
         * subqueries that return one value such as `(SELECT COUNT(*) FROM Demo_Users) AS demo_users_count`;
         *
         * correlated subqueries such as `(SELECT Email from Users WHERE User_ID = Registrations.User_ID)` when `Registrations` is the value of the `tableName` argument (i.e., the singular table from which records are being pulled);
         *
         * window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties.
         *
         * The possibilities are endless--there are numerous possibilities with which to experiment.
         * @param {string} [selectionCriteriaObj.where=''] `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively.
         * @param {string} [selectionCriteriaObj.groupBy=''] `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations.
         * @param {string} [selectionCriteriaObj.orderBy=''] `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire.
         * @param {number} [selectionCriteriaObj.limit=100] Specifies the maximum number of records to be returned. Maximum possible value of `1000` with a default value of `100`. Skipped if either `pageNumber` or `pageSize` has been specified.
         * @param {number} [selectionCriteriaObj.pageNumber] Page number corresponding to the pagination that results from the initial query. Defaults to `1` if `pageSize` has been specified but `pageNumber` has not.
         * @param {number} [selectionCriteriaObj.pageSize] Number of records per page (possible from `5` to `1000`). Defaults to `25` if `pageNumber` has been specified but `pageSize` has not.
         * @returns {Promise<Array.<Object>>} An array of objects representing the records retrieved from the specified table (i.e., `tableName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).
         * @since 1.0.0
         * @example
         * // get the default of 100 records from the Demo_Users table using
         * // the query criteria provided in the criteriaObj object
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getPaginatedTableRecords() {
         *   const criteriaObj = {
         *     select: 'Email, ROW_NUMBER() OVER (PARTITION BY Role ORDER BY User_ID) AS rnk_num',
         *     where: `Name LIKE '%ed%'`,
         *     orderBy: 'rnk_num'
         *   }
         *   const tableRecords = await caspio.tables.getRecordsPaginated('Demo_Users', criteriaObj);
         *   console.log(tableRecords);
         *   return tableRecords;
         * }
         *
         * getPaginatedTableRecords();
         *
         * // sample return value
         * [
         *   { Email: 'Frederick_Sanford@yahoo.com', rnk_num: 1 },
         *   { Email: 'Edwardo.Roberts@gmail.com', rnk_num: 1 },
         *   { Email: 'Fred.Daugherty41@hotmail.com', rnk_num: 2 },
         *   { Email: 'Winifred.Stamm41@hotmail.com', rnk_num: 2 },
         *   { Email: 'Winifred.Friesen@hotmail.com', rnk_num: 3 },
         *   { Email: 'Alan.Schroeder@gmail.com', rnk_num: 3 },
         *   ...
         *   { Email: 'Meredith.Botsford50@hotmail.com', rnk_num: 48 },
         *   { Email: 'Braeden63@gmail.com', rnk_num: 48 },
         *   { Email: 'Eddie_Tromp@hotmail.com', rnk_num: 49 },
         *   { Email: 'Ned39@gmail.com', rnk_num: 49 },
         *   { Email: 'Edna92@hotmail.com', rnk_num: 50 },
         *   { Email: 'Soledad.Collins84@yahoo.com', rnk_num: 50 }
         * ]
         */
        getRecordsPaginated: async (tableName, selectionCriteriaObj = {}) => {
          const queryString = _utils.criteriaQueryBuilderPaginated(selectionCriteriaObj);
          if (queryString) {
            try {
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/tables/${tableName}/records${queryString}`,
                headers: caspioHeaders,
              });
              const resultSet = theReq.data.Result;
              return resultSet;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Returns *all* records from the table that satisfy the provided query criteria (i.e., `selectionCriteriaObj`). Pagination is automatically handled to ensure all records matching the provided criteria are returned.
         *
         * **Note (potential strain on memory resources):** If the query provided results in many thousands or millions of records needing to be returned, then this may cause a strain on memory resources (since all returned records are held in memory when using this method). Consider using the `getRecordsStreamToFile` method in such an instance where all returned records can be streamed to a file in batches of `1000` records (i.e., the maximum number of records Caspio's REST API will respond with for any request).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {Object} [selectionCriteriaObj={}] Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`.
         *
         * In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on.
         *
         * **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate).
         * @param {string} [selectionCriteriaObj.select='*'] List of fields separated by comma, where fields may either be fields directly from the specified table or could be a combination of numerous other things:
         *
         * aliases such as `First_Name AS name`;
         *
         * subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`;
         *
         * correlated subqueries such as `(SELECT Email from Users WHERE User_ID = Registrations.User_ID)` where `Registrations` is the value of the `tableName` argument (i.e., the singular table from which records are being pulled);
         *
         * window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties.
         *
         * The possibilities are endless--there are numerous possibilities with which to experiment.
         * @param {string} [selectionCriteriaObj.where=''] `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively.
         * @param {string} [selectionCriteriaObj.groupBy=''] `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations.
         * @param {string} [selectionCriteriaObj.orderBy=''] `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire.
         * @returns {Promise<Array.<Object>>} An array of objects representing the records retrieved from the specified table (i.e., `tableName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).
         * @since 1.0.0
         * @example
         * // get records from the 'Demo_Users' table using the query criteria
         * // provided in the criteriaObj object
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getTableRecords() {
         *   const criteriaObj = {
         *     select: 'Email, ROW_NUMBER() OVER (PARTITION BY Role ORDER BY User_ID) AS rnk_num',
         *     where: `Name LIKE '%ed%'`,
         *     orderBy: 'rnk_num'
         *   }
         *   const tableRecords = await caspio.tables.getRecords('Demo_Users', criteriaObj);
         *   console.log(tableRecords);
         *   return tableRecords;
         * }
         *
         * getTableRecords();
         *
         * // sample return value
         * [
         *   { "Email": "Edwardo.Roberts@gmail.com", "rnk_num": 1 },
         *   { "Email": "Frederick_Sanford@yahoo.com", "rnk_num": 1 },
         *   { "Email": "Winifred.Stamm41@hotmail.com", "rnk_num": 2 },
         *   { "Email": "Fred.Daugherty41@hotmail.com", "rnk_num": 2 },
         *   { "Email": "Alan.Schroeder@gmail.com", "rnk_num": 3 },
         *   ...
         *   { "Email": "Eliane.Schroeder@hotmail.com", "rnk_num": 81 },
         *   { "Email": "Jedediah_Bednar33@yahoo.com", "rnk_num": 81 },
         *   { "Email": "Edyth3@gmail.com", "rnk_num": 82 },
         *   { "Email": "Magdalen84@hotmail.com", "rnk_num": 82 },
         *   { "Email": "Edyth_Mayer@yahoo.com", "rnk_num": 83 },
         *   { "Email": "Eddie_Predovic14@hotmail.com", "rnk_num": 84 },
         *   { "Email": "Francesca_Medhurst39@yahoo.com", "rnk_num": 85 },
         *   { "Email": "Jedediah.Mitchell@hotmail.com", "rnk_num": 86 },
         *   { "Email": "Wilfred_Funk20@gmail.com", "rnk_num": 87 },
         *   { "Email": "Mohamed.Hammes@hotmail.com", "rnk_num": 88 },
         *   { "Email": "Frieda_Strosin@gmail.com", "rnk_num": 89 },
         *   { "Email": "Ted.Anderson94@yahoo.com", "rnk_num": 90 },
         *   { "Email": "Jedediah.Runolfsson60@yahoo.com", "rnk_num": 91 },
         *   { "Email": "Destiny.Schroeder@hotmail.com", "rnk_num": 92 },
         *   { "Email": "Edwina.Barrows@yahoo.com", "rnk_num": 93 },
         *   { "Email": "Carlie_Bednar@gmail.com", "rnk_num": 94 },
         *   { "Email": "Ebony25@gmail.com", "rnk_num": 95 },
         *   { "Email": "Lexi81@hotmail.com", "rnk_num": 96 },
         *   { "Email": "Frederique.Kuhn86@gmail.com", "rnk_num": 97 },
         *   { "Email": "Winifred_Aufderhar63@yahoo.com", "rnk_num": 98 },
         *   { "Email": "Edd_Carroll0@hotmail.com", "rnk_num": 99 }
         * ]
         */
        getRecords: async (tableName, selectionCriteriaObj = {}) => {
          const queryObj = { ...selectionCriteriaObj };
          queryObj.limit = 1000;
          delete queryObj.pageNumber;
          delete queryObj.pageSize;
          const queryString = _utils.criteriaQueryBuilder(queryObj);
          if (queryString) {
            try {
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/tables/${tableName}/records${queryString}`,
                headers: caspioHeaders,
              });
              const resultSet = theReq.data.Result;

              if (resultSet.length < 1000) {
                return resultSet;
              }
              let stillQueryAPI = true;
              // ensure all records are retrieved by overriding any value set for pageNumber query parameter
              queryObj.pageNumber = 2;
              queryObj.pageSize = 1000;
              let allRecords = [...resultSet];
              while (stillQueryAPI) {
                const queryString = _utils.criteriaQueryBuilder(queryObj);
                const singleRequest = await axios({
                  method: 'get',
                  url: `${baseURL}/v2/tables/${tableName}/records${queryString}`,
                  headers: caspioHeaders,
                });
                const retrievedRecords = singleRequest.data.Result;
                if (retrievedRecords.length === 0) {
                  stillQueryAPI = !stillQueryAPI;
                } else {
                  allRecords = [...allRecords, ...retrievedRecords];
                  queryObj.pageNumber++;
                }
              }
              return allRecords;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Streams *all* records from the table (i.e., `tableName`) that satisfy the provided query criteria (i.e., `selectionCriteriaObj`) to a file (i.e., `filePath`). Pagination is automatically handled to ensure all records matching the provided criteria are streamed to the specified file. Records are streamed in batches of `1000` records (Caspio's rate limit for returning records). Useful when you need to process huge amounts of data but do not want to hold everything in memory.
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} filePath Path of file to write to (file path should have an extension of `.json`)
         * @param {Object} [selectionCriteriaObj={}] Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`.
         *
         * In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on.
         *
         * **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate).
         * @param {string} [selectionCriteriaObj.select='*'] List of fields separated by comma, where fields may either be fields directly from the specified table or could be a combination of numerous other things:
         *
         * aliases such as `First_Name AS name`;
         *
         * subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`;
         *
         * correlated subqueries such as `(SELECT Email from Users WHERE User_ID = Registrations.User_ID)` where `Registrations` is the value of the `tableName` argument (i.e., the singular table from which records are being pulled);
         *
         * window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties.
         *
         * The possibilities are endless--there are numerous possibilities with which to experiment.
         * @param {string} [selectionCriteriaObj.where=''] `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively.
         * @param {string} [selectionCriteriaObj.groupBy=''] `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations.
         * @param {string} [selectionCriteriaObj.orderBy=''] `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire.
         * @returns {void} No value is returned
         * @since 1.0.0
         * @example
         * // stream all records from the 'Demo_Users' table to the 'StreamedDemoUsers.json' file
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function streamTableRecordsToFile() {
         *   await caspio.tables.getRecordsStreamToFile('Demo_Users', 'StreamedDemoUsers.json');
         * }
         *
         * streamTableRecordsToFile();
         *
         * // no return value
         */
        getRecordsStreamToFile: async (tableName, filePath, selectionCriteriaObj = {}) => {
          const queryObj = { ...selectionCriteriaObj };
          queryObj.limit = 1000;
          delete queryObj.pageNumber;
          delete queryObj.pageSize;
          const queryString = _utils.criteriaQueryBuilder(queryObj);
          if (queryString) {
            const eventDataStream = fs.createWriteStream(filePath);
            const transformStream = JSONStream.stringify('[', ',', ']\n');
            transformStream.pipe(eventDataStream);
            try {
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/tables/${tableName}/records${queryString}`,
                headers: caspioHeaders,
              });
              let resultSet = theReq.data.Result;
              if (resultSet.length > 0 && Object.prototype.hasOwnProperty.call(resultSet[0], 'PK_ID')) {
                resultSet = _utils.stripPKIDFields(resultSet);
              }
              resultSet.forEach(transformStream.write);

              if (resultSet.length < 1000) {
                transformStream.end();
              } else {
                let stillQueryAPI = true;
                // ensure all records are retrieved by overriding any value set for pageNumber query parameter
                queryObj.pageNumber = 2;
                queryObj.pageSize = 1000;
                while (stillQueryAPI) {
                  const queryString = _utils.criteriaQueryBuilder(queryObj);
                  const singleRequest = await axios({
                    method: 'get',
                    url: `${baseURL}/v2/tables/${tableName}/records${queryString}`,
                    headers: caspioHeaders,
                  });
                  let retrievedRecords = singleRequest.data.Result;
                  if (retrievedRecords.length === 0) {
                    stillQueryAPI = !stillQueryAPI;
                  } else {
                    if (Object.prototype.hasOwnProperty.call(retrievedRecords[0], 'PK_ID')) {
                      retrievedRecords = _utils.stripPKIDFields(retrievedRecords);
                    }
                    retrievedRecords.forEach(transformStream.write);
                    queryObj.pageNumber++;
                  }
                }
                transformStream.end();
              }
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Updates all records in table `tableName` matched by `whereClause` (i.e., the provided `WHERE` clause) with values from the `newRecordValuesObj` object.
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} whereClause `WHERE` clause (i.e., query to match records to be affected)
         * @param {object} newRecordValuesObj Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be updated and the key's value should be the *updated* value for that field (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`).
         *
         * **Note (warnings about updating a record's list field values):** If you are trying to update the values for a record's `ListField` property (i.e., when a record's field has a `Type` of `LIST-STRING|NUMBER|DATE/TIME`), then be aware that you may be in for a world of pain (read: not recommended). Why?
         *
         * First, you have to know the numeric values of the keys for the key-value pairs that make up a `ListField`'s definition. For example, suppose the definition of your list field is `{ "1": "Cat", "2": "Dog", "3": "Frog" }`. If you want to have `"Dog"` and `"Frog"` as the list values for the updated record(s), then you have to specify the `ListField` as follows: `ListField: [ 2, 3 ]`. How are you supposed to know the key values ahead of time? Only by querying the table for its definition with something like the `tables.definition` method.
         *
         * Second, if you happen to specify an index value that does not currently exist in a list field's definition, then you'll get something like the following `400` error: `"Cannot perform operation because the value doesn't match the data type of the following field(s): <field-name>"`.
         *
         * Third, if you update records by *only* specifying fields with a `Type` of `LIST-STRING|NUMBER|DATE/TIME` (i.e., all field values you are updating are of the list type variety), then the `RecordsAffected` property on the response object will read `0` even if numerous records were updated. This is obviously a bug.
         *
         * Fourth (as if you needed another reason to avoid updating values in list fields), if `{ 'rows': true }` is specified on the request while updating list field values *only*, then Caspio's servers throw a 500 error. The reason *why* is not entirely clear. This is also obviously a bug.
         *
         * The whole thing is janky as hell and thus not recommended unless you really know what you're doing (even then you might get unlucky).
         * @param {object} [options={ 'rows': false }] The `options` object currently only supports the `rows` option. If no object is provided, then `{ 'rows': false }` is taken as the default value. If an `options` object is provided with a `rows` property value of `true`, then the records updated by the query are returned in the response object as the value for the `updatedRecords` property; otherwise, the response object does not have an `updatedRecords` property and no updated records are returned.
         * @param {boolean} [options.rows=false]
         * @returns {Promise<{status: 200, statusText: 'OK', message: string, recordsAffected: number}|{status: 200, statusText: 'OK', message: string, recordsAffected: number, updatedRecords: Array.<Object>}>} Object with information about the attempted update of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, `recordsAffected`, and `updatedRecords` if the `options` argument was passed as `{ 'rows': true }`)
         * @since 1.0.0
         * @example
         * // Update the 'Name' field in the 'Demo_Users' table to have a value of
         * // 'Eddy Rath' for all records that have an 'Email' field with value 'Edd36@yahoo.com'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function updateTableRecords() {
         *   const whereClause = `Email = 'Edd36@yahoo.com'`;
         *   const newValuesObj = {
         *     Name: "Eddy Rath"
         *   }
         *   const updateResult = await caspio.tables.updateRecords('Demo_Users', whereClause, newValuesObj, { rows: true });
         *   console.log(updateResult);
         *   return updateResult;
         * }
         *
         * updateTableRecords();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "1 record(s) affected. Note: If the number of affected records is higher than expected, then be sure to check any triggered actions associated with the 'Demo_Users' table, which can cause various records in other tables to be affected.",
         *   recordsAffected: 1,
         *   updatedRecords: [
         *     {
         *       User_ID: '7NQC2PHT',
         *       Name: 'Eddy Rath',
         *       Email: 'Edd36@yahoo.com',
         *       Role: 'Admin',
         *       Active: false
         *     }
         *   ]
         * }
         */
        updateRecords: async (tableName, whereClause, newRecordValuesObj, options = { rows: false }) => {
          const processedWhereClause = _utils.whereClauseBuilder(whereClause);
          if (typeof processedWhereClause === 'string') {
            try {
              if (!Object.prototype.hasOwnProperty.call(options, 'rows')) {
                throw new Error('The fourth argument to the updateRecords function must be an object with a \'rows\' property. If the \'rows\' property value is the boolean true, then the updated records are returned; otherwise, the returned records are not returned.');
              }
              const responseClause = options.rows ? 'rows' : '';
              const theReq = await axios({
                method: 'put',
                url: `${baseURL}/v2/tables/${tableName}/records?q.where=${processedWhereClause}&response=${responseClause}`,
                headers: caspioHeaders,
                data: newRecordValuesObj,
              });
              console.log(theReq);
              const { status, statusText, data: { RecordsAffected: recordsAffected, Result: updatedRecords } } = theReq;
              const message = `${recordsAffected} record(s) affected. Note: If the number of affected records is higher than expected, then be sure to check any triggered actions associated with the '${tableName}' table, which can cause various records in other tables to be affected.`;
              let responseObj;
              if (updatedRecords.length > 0) {
                responseObj = {
                  status, statusText, message, recordsAffected, updatedRecords,
                };
              } else {
                responseObj = {
                  status, statusText, message, recordsAffected,
                };
              }
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Inserts record `recordValuesObj` into table `tableName` (i.e., creates a record).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {object} recordValuesObj Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be updated and the key's value should be the intended value for that field with the appropriate data type (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`).
         *
         * **Note (warnings about creating a record with list field values):** If you are trying to create the values for a record's `ListField` property (i.e., when a record's field has a `Type` of `LIST-STRING|NUMBER|DATE/TIME`), then be aware that you may be in for a world of pain (read: not recommended). Why?
         *
         * First, you have to know the numeric values of the keys for the key-value pairs that make up a `ListField`'s definition. For example, suppose the definition of your list field is `{ "1": "Cat", "2": "Dog", "3": "Frog" }`. If you want to have `"Dog"` and `"Frog"` as the list values for the created record, then you have to specify the `ListField` as follows: `ListField: [ 2, 3 ]`. How are you supposed to know the key values ahead of time? Only by querying the table for its definition with something like the `tables.definition` method.
         *
         * Second, if you happen to specify an index value that does not currently exist in a list field's definition, then you'll get something like the following `400` error: `"Cannot perform operation because the value doesn't match the data type of the following field(s): <field-name>"`.
         *
         * The whole thing is janky as hell and thus not recommended unless you really know what you're doing (even then you might get unlucky).
         * @param {object} [options={ 'row': false }] The `options` object currently only supports the `row` option. If no object is provided, then `{ 'row': false }` is taken as the default value. If an `options` object is provided with a `row` property value of `true`, then the record created by the query is returned in the response object as the value for the `createdRecord` property; otherwise, the response object does not have a `createdRecord` property and no created record is returned.
         * @param {boolean} [options.row=false]
         * @returns {Promise<{status: 201, statusText: 'Created', message: string}|{status: 201, statusText: 'Created', message: string, createdRecord: object}>} Object with information about the attempted creation of the provided record (i.e., `status`, `statusText`, `message`, and `createdRecord` if the `options` argument was passed as `{ 'row': true }`)
         * @since 1.0.0
         * @example
         * // create and return a record in the 'Demo_Users' table with a 'Name' field value of 'Osment'
         * // and an 'Email' field value of 'Osment@google.com'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function createTableRecord() {
         *   const newRecordObj = {
         *     Name: "Osment",
         *     Email: "Osment@google.com",
         *   }
         *   const creationResult = await caspio.tables.createRecord('Demo_Users', newRecordObj, { row: true });
         *   console.log(creationResult);
         *   return creationResult;
         * }
         *
         * createTableRecord();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: "Record successfully created in 'Demo_Users' table.",
         *   createdRecord: {
         *     User_ID: 'QNFPG6OT',
         *     Name: 'Osment',
         *     Email: 'Osment@google.com',
         *     Role: '',
         *     Active: false
         *   }
         * }
         */
        createRecord: async (tableName, recordValuesObj, options = { row: false }) => {
          try {
            if (!Object.prototype.hasOwnProperty.call(options, 'row')) {
              throw new Error('The third argument to the createRecord function must be an object with a \'row\' property. If the \'row\' property value is the boolean true, then the created record is returned; otherwise, the created record is not returned.');
            }
            const responseClause = options.row ? 'rows' : '';
            const theReq = await axios({
              method: 'post',
              url: `${baseURL}/v2/tables/${tableName}/records?response=${responseClause}`,
              headers: caspioHeaders,
              data: recordValuesObj,
            });
            const { status, statusText, data: { Result: newRecordArr } } = theReq;
            const message = `Record successfully created in '${tableName}' table.`;
            let responseObj;
            if (newRecordArr) {
              // a maximum of 1 record is ever returned
              const createdRecord = newRecordArr[0];
              responseObj = {
                status, statusText, message, createdRecord,
              };
            } else {
              responseObj = { status, statusText, message };
            }
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Deletes all records from table `tableName` that match `whereClause` (i.e., the provided `WHERE` clause).
         *
         * @memberOf Tables
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} whereClause `WHERE` clause (i.e., query to match records to be affected)
         * @returns {Promise<{status: 200, statusText: 'OK', message: string, recordsAffected: number}>} Object with information about the attempted deletion of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, and `recordsAffected`)
         * @since 1.0.0
         * @example
         * // delete all records from the 'Demo_Users' table that have
         * // an 'Email' field value of 'Osment@google.com'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function deleteTableRecords() {
         *   const whereClause = `Email = 'Osment@google.com'`;
         *   const deleteResult = await caspio.tables.deleteRecords('Demo_Users', whereClause);
         *   console.log(deleteResult);
         *   return deleteResult;
         * }
         *
         * deleteTableRecords();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "1 record(s) in table 'Demo_Users' successfully deleted.",
         *   recordsAffected: 1
         * }
         */
        deleteRecords: async (tableName, whereClause) => {
          const processedWhereClause = _utils.whereClauseBuilder(whereClause);
          if (typeof processedWhereClause === 'string') {
            try {
              const theReq = await axios({
                method: 'delete',
                url: `${baseURL}/v2/tables/${tableName}/records?q.where=${processedWhereClause}`,
                headers: caspioHeaders,
              });
              const { status, statusText, data: { RecordsAffected: recordsAffected } } = theReq;
              const message = `${recordsAffected} record(s) in table '${tableName}' successfully deleted.`;
              const responseObj = {
                status, statusText, message, recordsAffected,
              };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
      },
      /**
       * Methods for views.
       *
       * @namespace Views
       */
      views: {
        /**
         * Returns an array of strings where each string represents an available view for a Caspio account.
         *
         * @memberOf Views
         * @returns {Promise<Array<string>>} Array of strings representing view names for a Caspio account
         * @since 1.0.0
         * @example
         * // get list of all view names linked to a Caspio account
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getViewNames() {
         *   const viewNames = await caspio.views.listing();
         *   console.log(viewNames);
         *   return viewNames;
         * }
         *
         * getViewNames();
         *
         * // sample return value
         * [
         *   ...
         *   'Demo_Admins_Active',
         *   'Demo_Physicians_Active',
         *   'Demo_Physicians_Published',
         *   ...
         * ]
         */
        listing: async () => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/views`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns the description of the view (i.e., a description of view `viewName`).
         *
         * @memberOf Views
         * @param {string} viewName Name of the view (case-insensitive)
         * @returns {Promise<{Name: string, Note: string}>} Object with the name of view (i.e., `Name`) and a note about the view (i.e., `Note`)
         * @since 1.0.0
         * @example
         * // get description of the 'Demo_Physicians_Active' view
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getViewDescription() {
         *   const VIEW_NAME = 'Demo_Physicians_Active';
         *   const description = await caspio.views.description(VIEW_NAME);
         *   console.log(description);
         *   return description;
         * }
         *
         * getViewDescription();
         *
         * // sample return value
         * { Name: 'Demo_Physicians_Active', Note: '' }
         */
        description: async (viewName) => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/views/${viewName}`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns records in a paginated fashion from view `viewName` that satisfy the provided query criteria (i.e., `selectionCriteriaObj`).
         *
         * @memberOf Views
         * @param {string} viewName Name of view (case-insensitive)
         * @param {Object} [selectionCriteriaObj={}] Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, `orderBy`, `limit`, `pageNumber`, and `pageSize`.
         *
         * In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on.
         *
         * **Note:** Usage of window functions (e.g., `ROW_NUMBER()`) when expecting more than `1000` records is problematic due to being rate-limited by Caspio's servers at 1000 records per request (hence there's not an effective window within which to operate).
         * @param {string} [selectionCriteriaObj.select='*'] List of fields separated by comma, where fields may either be fields directly from the specified view or could be a combination of numerous other things:
         *
         * aliases such as `First_Name AS name`;
         *
         * subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`;
         *
         * correlated subqueries such as `(SELECT Email FROM Users WHERE Participant_ID = _v_Highlighted_Users.Participant_ID), Notable_Highlight` when `Highlighted_Users` is the value of the `viewName` argument (i.e., the singular view from which records are being pulled);
         *
         * window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties.
         *
         * The possibilities are endless--there are numerous possibilities with which to experiment.
         *
         * **Note:** If you want to use a view in a correlated subquery as shown above, then be sure to add a prefix of `_v_` to the view name, as specified in Caspio's documentation on [calculations in reports](https://howto.caspio.com/datapages/reports/advanced-reporting/calculations-in-forms-and-reports/).
         * @param {string} [selectionCriteriaObj.where=''] `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively.
         * @param {string} [selectionCriteriaObj.groupBy=''] `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations.
         * @param {string} [selectionCriteriaObj.orderBy=''] `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire.
         * @param {number} [selectionCriteriaObj.limit=100] Specifies the maximum number of records to be returned. Maximum possible value of `1000` with a default value of `100`. Skipped if either `pageNumber` or `pageSize` has been specified.
         * @param {number} [selectionCriteriaObj.pageNumber] Page number corresponding to the pagination that results from the initial query. Defaults to `1` if `pageSize` has been specified but `pageNumber` has not.
         * @param {number} [selectionCriteriaObj.pageSize] Number of records per page (possible from `5` to `1000`). Defaults to `25` if `pageNumber` has been specified but `pageSize` has not.
         * @returns {Promise<Array.<Object>>} An array of objects representing the records retrieved from the specified view (i.e., `viewName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).
         * @since 1.0.0
         * @example
         * // get a single record from the 'Demo_Physicians_Active' view
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getPaginatedViewRecords() {
         *   const criteriaObj = {
         *     limit: 1
         *   }
         *   const VIEW_NAME = 'Demo_Physicians_Active';
         *   const viewRecords = await caspio.views.getRecordsPaginated(VIEW_NAME, criteriaObj);
         *   console.log(viewRecords);
         *   return viewRecords;
         * }
         *
         * getPaginatedViewRecords();
         *
         * // sample return value
         * [
         *   {
         *     Physician_ID: '6T2C9HW8',
         *     Date_Created: '2020-10-07T04:54:19',
         *     First_Name: 'Lelah',
         *     Last_Name: 'Hoppe',
         *     Full_Name: 'Lelah Hoppe',
         *     Gender: 'Other',
         *     Email: 'Lelah.Hoppe@gmail.com',
         *     Account_Status: true,
         *     Profile_Status: false,
         *     Profile_Picture: '/Demo/LelahHoppe.png',
         *     Specialties: {
         *       '3': 'Family Medicine',
         *       '6': 'Obstetrics and Gynecology',
         *       '8': 'Pain Management',
         *       '9': 'Pathology'
         *     },
         *     About_Section: 'Exercitationem ... labore.',
         *     Education_and_Training: 'David Geffen School of Medicine - MD\n' +
         *       'Yale - Residency, Ophthalmology\n' +
         *       'Yale - Fellowship, Cataracts and Refractive Surgery',
         *     Languages_Spoken: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
         *     Office_Address: '0519 Mustafa Via',
         *     Office_City: 'New Bradlyhaven',
         *     Office_State: 'MI',
         *     Office_Zip: '50198',
         *     Title: 'Adolescent Medicine Specialist',
         *     Accepting_New_Patients: true,
         *     Affiliations: 'American College of Endocrinology\n' +
         *       'The Endocrine Society\n' +
         *       'American Diabetes Association',
         *     Board_Certifications: 'American Board of Pediatrics',
         *     Office_Name: 'Davis Family Medical Group',
         *     Office_Phone: '967-841-6054',
         *     ViewCount: 3654
         *   }
         * ]
         */
        getRecordsPaginated: async (viewName, selectionCriteriaObj = {}) => {
          const queryString = _utils.criteriaQueryBuilderPaginated(selectionCriteriaObj);
          if (queryString) {
            try {
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/views/${viewName}/records${queryString}`,
                headers: caspioHeaders,
              });
              const resultSet = theReq.data.Result;
              return resultSet;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Returns *all* records from the view that satisfy the provided query criteria (i.e., `selectionCriteriaObj`). Pagination is automatically handled to ensure all records matching the provided criteria are returned.
         *
         * **Note (potential strain on memory resources):** If the query provided results in many thousands or millions of records needing to be returned, then this may cause a strain on memory resources (since all returned records are held in memory when using this method). Consider using the `getRecordsStreamToFile` method in such an instance where all returned records can be streamed to a file in batches of `1000` records (i.e., the maximum number of records Caspio's REST API will respond with for any request).
         *
         * @memberOf Views
         * @param {string} viewName Name of view (case-insensitive)
         * @param {Object} [selectionCriteriaObj={}] Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`.
         *
         * In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on.
         *
         * **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate).
         * @param {string} [selectionCriteriaObj.select='*'] List of fields separated by comma, where fields may either be fields directly from the specified view or could be a combination of numerous other things:
         *
         * aliases such as `First_Name AS name`;
         *
         * subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`;
         *
         * correlated subqueries such as `(SELECT Email FROM Users WHERE Participant_ID = _v_Highlighted_Users.Participant_ID), Notable_Highlight` when `Highlighted_Users` is the value of the `viewName` argument (i.e., the singular view from which records are being pulled);
         *
         * window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties.
         *
         * The possibilities are endless--there are numerous possibilities with which to experiment.
         *
         * **Note:** If you want to use a view in a correlated subquery as shown above, then be sure to add a prefix of `_v_` to the view name, as specified in Caspio's documentation on [calculations in reports](https://howto.caspio.com/datapages/reports/advanced-reporting/calculations-in-forms-and-reports/).
         * @param {string} [selectionCriteriaObj.where=''] `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively.
         * @param {string} [selectionCriteriaObj.groupBy=''] `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations.
         * @param {string} [selectionCriteriaObj.orderBy=''] `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire.
         * @returns {Promise<Array.<Object>>} An array of objects representing the records retrieved from the specified view (i.e., `viewName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).
         * @since 1.0.0
         * @example
         * // get all records from the 'Demo_Physicians_Active' view
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getViewRecords() {
         *   const VIEW_NAME = 'Demo_Physicians_Active';
         *   const viewRecords = await caspio.views.getRecords(VIEW_NAME);
         *   console.log(viewRecords);
         *   return viewRecords;
         * }
         *
         * getViewRecords();
         *
         * // sample return value
         * [
         *   ...,
         *   {
         *     Physician_ID: '6T2C9HW8',
         *     Date_Created: '2020-10-07T04:54:19',
         *     First_Name: 'Lelah',
         *     Last_Name: 'Hoppe',
         *     Full_Name: 'Lelah Hoppe',
         *     Gender: 'Other',
         *     Email: 'Lelah.Hoppe@gmail.com',
         *     Account_Status: true,
         *     Profile_Status: false,
         *     Profile_Picture: '/Demo/LelahHoppe.png',
         *     Specialties: {
         *       '3': 'Family Medicine',
         *       '6': 'Obstetrics and Gynecology',
         *       '8': 'Pain Management',
         *       '9': 'Pathology'
         *     },
         *     About_Section: 'Exercitationem ... labore.',
         *     Education_and_Training: 'David Geffen School of Medicine - MD\n' +
         *       'Yale - Residency, Ophthalmology\n' +
         *       'Yale - Fellowship, Cataracts and Refractive Surgery',
         *     Languages_Spoken: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
         *     Office_Address: '0519 Mustafa Via',
         *     Office_City: 'New Bradlyhaven',
         *     Office_State: 'MI',
         *     Office_Zip: '50198',
         *     Title: 'Adolescent Medicine Specialist',
         *     Accepting_New_Patients: true,
         *     Affiliations: 'American College of Endocrinology\n' +
         *       'The Endocrine Society\n' +
         *       'American Diabetes Association',
         *     Board_Certifications: 'American Board of Pediatrics',
         *     Office_Name: 'Davis Family Medical Group',
         *     Office_Phone: '967-841-6054',
         *     ViewCount: 3654
         *   },
         *   ...
         * ]
         */
        getRecords: async (viewName, selectionCriteriaObj = {}) => {
          const queryObj = { ...selectionCriteriaObj };
          queryObj.limit = 1000;
          delete queryObj.pageNumber;
          delete queryObj.pageSize;
          const queryString = _utils.criteriaQueryBuilder(queryObj);
          if (queryString) {
            try {
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/views/${viewName}/records${queryString}`,
                headers: caspioHeaders,
              });
              const resultSet = theReq.data.Result;

              if (resultSet.length < 1000) {
                return resultSet;
              }
              let stillQueryAPI = true;
              // ensure all records are retrieved by overriding any value set for pageNumber query parameter
              queryObj.pageNumber = 2;
              queryObj.pageSize = 1000;
              let allRecords = [...resultSet];
              while (stillQueryAPI) {
                const queryString = _utils.criteriaQueryBuilder(queryObj);
                const singleRequest = await axios({
                  method: 'get',
                  url: `${baseURL}/v2/views/${viewName}/records${queryString}`,
                  headers: caspioHeaders,
                });
                const retrievedRecords = singleRequest.data.Result;
                if (retrievedRecords.length === 0) {
                  stillQueryAPI = !stillQueryAPI;
                } else {
                  allRecords = [...allRecords, ...retrievedRecords];
                  queryObj.pageNumber++;
                }
              }
              return allRecords;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Streams *all* records from the view (i.e., `viewName`) that satisfy the provided query criteria (i.e., `selectionCriteriaObj`) to a file (i.e., `filePath`). Pagination is automatically handled to ensure all records matching the provided criteria are streamed to the specified file. Records are streamed in batches of `1000` records (Caspio's rate limit for returning records). Useful when you need to process huge amounts of data but do not want to hold everything in memory.
         *
         * @memberOf Views
         * @param {string} viewName Name of view (case-insensitive)
         * @param {string} filePath Path of file to write to (file path should have an extension of `.json`)
         * @param {Object} [selectionCriteriaObj={}] Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`.
         *
         * In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on.
         *
         * **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate).
         * @param {string} [selectionCriteriaObj.select='*'] List of fields separated by comma, where fields may either be fields directly from the specified view or could be a combination of numerous other things:
         *
         * aliases such as `First_Name AS name`;
         *
         * subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`;
         *
         * correlated subqueries such as `(SELECT Email FROM Users WHERE Participant_ID = _v_Highlighted_Users.Participant_ID), Notable_Highlight` when `Highlighted_Users` is the value of the `viewName` argument (i.e., the singular view from which records are being pulled);
         *
         * window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties.
         *
         * The possibilities are endless--there are numerous possibilities with which to experiment.
         *
         * **Note:** If you want to use a view in a correlated subquery as shown above, then be sure to add a prefix of `_v_` to the view name, as specified in Caspio's documentation on [calculations in reports](https://howto.caspio.com/datapages/reports/advanced-reporting/calculations-in-forms-and-reports/).
         * @param {string} [selectionCriteriaObj.where=''] `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively.
         * @param {string} [selectionCriteriaObj.groupBy=''] `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations.
         * @param {string} [selectionCriteriaObj.orderBy=''] `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire.
         * @returns {void} No value is returned
         * @since 1.0.0
         * @example
         * // stream all records from the 'Demo_Physicians_Active' view
         * // to the 'Demo_Physicians_Active.json' file
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function streamViewRecordsToFile() {
         *   const VIEW_NAME = 'Demo_Physicians_Active';
         *   const FILE_PATH = 'Demo_Physicians_Active.json';
         *   await caspio.views.getRecordsStreamToFile(VIEW_NAME, FILE_PATH);
         * }
         *
         * streamViewRecordsToFile();
         *
         * // no return value
         */
        getRecordsStreamToFile: async (viewName, filePath, selectionCriteriaObj = {}) => {
          const queryObj = { ...selectionCriteriaObj };
          queryObj.limit = 1000;
          delete queryObj.pageNumber;
          delete queryObj.pageSize;
          const queryString = _utils.criteriaQueryBuilder(queryObj);
          if (queryString) {
            const eventDataStream = fs.createWriteStream(filePath);
            const transformStream = JSONStream.stringify('[', ',', ']\n');
            transformStream.pipe(eventDataStream);
            try {
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/views/${viewName}/records${queryString}`,
                headers: caspioHeaders,
              });

              let resultSet = theReq.data.Result;
              if (resultSet.length > 0 && Object.prototype.hasOwnProperty.call(resultSet[0], 'PK_ID')) {
                resultSet = _utils.stripPKIDFields(resultSet);
              }
              resultSet.forEach(transformStream.write);

              if (resultSet.length < 1000) {
                transformStream.end();
              } else {
                let stillQueryAPI = true;
                // ensure all records are retrieved by overriding any value set for pageNumber query parameter
                queryObj.pageNumber = 2;
                queryObj.pageSize = 1000;
                while (stillQueryAPI) {
                  const queryString = _utils.criteriaQueryBuilder(queryObj);
                  const singleRequest = await axios({
                    method: 'get',
                    url: `${baseURL}/v2/views/${viewName}/records${queryString}`,
                    headers: caspioHeaders,
                  });
                  let retrievedRecords = singleRequest.data.Result;
                  if (retrievedRecords.length === 0) {
                    stillQueryAPI = !stillQueryAPI;
                  } else {
                    if (Object.prototype.hasOwnProperty.call(retrievedRecords[0], 'PK_ID')) {
                      retrievedRecords = _utils.stripPKIDFields(retrievedRecords);
                    }
                    retrievedRecords.forEach(transformStream.write);
                    queryObj.pageNumber++;
                  }
                }
                transformStream.end();
              }
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
        /**
         * Updates all records in view `viewName` that match the provided `WHERE` clause. This method is generally *not* recommended due to the notes that follow. Directly updating records in a *table* should always be the preferred route since updating records in a view ultimately results in updating records in a single underlying table.
         *
         * **Note 1 (required conditions for updating view records):** Records may only be updated in a view if the view itself only contains a single table or if a particular table in the view has been specified as *editable* within the view's configuration. This can be done by selecting a table under the *"Do you need to edit data using this View?"* question when editing a view within Caspio.
         *
         * **Note 2 (updating a view record that results in the record's disappearance from the view):** It is possible for a record to be updated in the view but not appear in the `updatedRecords` array. How? If the record is no longer included in the view after the update, then the record does not appear as one of the records that was updated. For example, if a field value is being used to make the record appear in the view (e.g., `Account_Status` of `true` for the `Demo_Physicians_Active` view), then changing that field value may result in the field being excluded from the view (e.g., changing `Account_Status` from `true` to `false`), which would correspondingly exclude the updated record from the `updatedRecords` array in the response.
         *
         * @memberOf Views
         * @param {string} viewName Name of view (case-insensitive)
         * @param {string} whereClause `WHERE` clause (i.e., query to match records to be affected)
         * @param {object} newRecordValuesObj Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be updated and the key's value should be the *updated* value for that field (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`).
         * @param {object} [options={ 'rows': '' }] The `options` object currently only supports the `rows` option. If no object is provided, then `{ 'rows': false }` is taken as the default value. If an `options` object is provided with a `rows` property value of `true`, then the records updated by the query are returned in the response object as the value for the `updatedRecords` property; otherwise, the response object does not have an `updatedRecords` property and no updated records are returned.
         * @param {boolean} [options.rows=false]
         * @returns {Promise<{status: 200, statusText: 'OK', message: string, recordsAffected: number}|{status: 200, statusText: 'OK', message: string, recordsAffected: number, updatedRecords: Array.<Object>}>} Object with information about the attempted update of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, `recordsAffected`, and `updatedRecords` if the `options` argument was passed as `{ 'rows': true }`)
         * @since 1.0.0
         * @example
         * // update records in the 'Demo_Physicians_Active' to have a 'Profile_Status'
         * // field value of false for all records where the 'Email' field value is 'Lelah.Hoppe@gmail.com'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function updateViewRecords() {
         *   const whereClause = `Email = 'Lelah.Hoppe@gmail.com'`;
         *   const newValuesObj = {
         *     Profile_Status: false
         *   }
         *   const VIEW_NAME = 'Demo_Physicians_Active';
         *   const updateResult = await caspio.views.updateRecords(VIEW_NAME, whereClause, newValuesObj, { rows: true });
         *   console.log(updateResult);
         *   return updateResult;
         * }
         *
         * updateViewRecords();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: '1 record(s) affected.',
         *   recordsAffected: 1,
         *   updatedRecords: [
         *     {
         *       Physician_ID: '6T2C9HW8',
         *       Date_Created: '2020-10-07T04:54:19',
         *       First_Name: 'Lelah',
         *       Last_Name: 'Hoppe',
         *       Full_Name: 'Lelah Hoppe',
         *       Gender: 'Other',
         *       Email: 'Lelah.Hoppe@gmail.com',
         *       Account_Status: true,
         *       Profile_Status: false,
         *       Profile_Picture: '/Demo/LelahHoppe.png',
         *       Specialties: [Object],
         *       About_Section: 'Exercitationem ... labore.',
         *       Education_and_Training: 'David Geffen School of Medicine - MD\n' +
         *         'Yale - Residency, Ophthalmology\n' +
         *         'Yale - Fellowship, Cataracts and Refractive Surgery',
         *       Languages_Spoken: [Object],
         *       Office_Address: '0519 Mustafa Via',
         *       Office_City: 'New Bradlyhaven',
         *       Office_State: 'MI',
         *       Office_Zip: '50198',
         *       Title: 'Adolescent Medicine Specialist',
         *       Accepting_New_Patients: true,
         *       Affiliations: 'American College of Endocrinology\n' +
         *         'The Endocrine Society\n' +
         *         'American Diabetes Association',
         *       Board_Certifications: 'American Board of Pediatrics',
         *       Office_Name: 'Davis Family Medical Group',
         *       Office_Phone: '967-841-6054',
         *       ViewCount: 3654
         *     }
         *   ]
         * }
         */
        updateRecords: async (viewName, whereClause, newRecordValuesObj, options = { rows: false }) => {
          try {
            if (!Object.prototype.hasOwnProperty.call(options, 'rows')) {
              throw new Error('The fourth argument to the updateRecords function must be an object with a \'rows\' property. If the \'rows\' property value is the boolean true, then the updated records are returned; otherwise, the updated records are not returned.');
            }
            const responseClause = options.rows ? 'rows' : '';
            const processedWhereClause = _utils.whereClauseBuilder(whereClause);
            if (typeof processedWhereClause === 'string') {
              const theReq = await axios({
                method: 'put',
                url: `${baseURL}/v2/views/${viewName}/records?q.where=${processedWhereClause}&response=${responseClause}`,
                headers: caspioHeaders,
                data: newRecordValuesObj,
              });
              const { status, statusText, data: { RecordsAffected: recordsAffected, Result: updatedRecords } } = theReq;
              const message = `${recordsAffected} record(s) affected.`;
              let responseObj;
              if (updatedRecords.length > 0) {
                responseObj = {
                  status, statusText, message, recordsAffected, updatedRecords,
                };
              } else {
                responseObj = {
                  status, statusText, message, recordsAffected,
                };
              }
              return responseObj;
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Creates a record in view `viewName` (generally not a recommended method to use due to the notes that follow). Directly creating a record in a *table* should always be the preferred route since creating a record in a view ultimately results in creating a single record in an underlying table.
         *
         * **Note 1 (required conditions for creating a record in a view):** Records may only be created in a view if the view itself only contains a single table or if a particular table in the view has been specified as *editable* within the view's configuration. This can be done by selecting a table under the *"Do you need to edit data using this View?"* question when editing a view within Caspio.
         *
         * **Note 2 (creating a record in a view where the record does not appear in the view):** It is possible for a record to be "created" in the view but not appear as the value for the `createdRecord` property of the response object. How? If the record is no longer included in the view after its creation, then the record does not appear as having been created in the view. How could this happen? If a field value is being used to make the record appear in the view, such as the `Account_Status` field needing to be `true` in a `Demo_Physicians_Active` view, then creating a record where the `Account_Status` field value was `false` would result in the record being excluded from the view but created in the underlying `Demo_Physicians` table; hence, the record would correspondingly be excluded from the `createdRecord` property of the response object.
         *
         * @memberOf Views
         * @param {string} viewName Name of view (case-insensitive)
         * @param {object} recordValuesObj Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be created and the key's value should be the value for that field (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`).
         * @param {object} [options={ 'row': false }] The `options` object currently only supports the `row` option. If no object is provided, then `{ 'row': false }` is taken as the default value. If an `options` object is provided with a `row` property value of `true`, then the record created by the query is returned in the response object as the value for the `createdRecord` property--if no record shows up as having been created, then `undefined` becomes the value for the `createdRecord` key.
         * @param {boolean} [options.row=false]
         * @returns {Promise<{status: 201, statusText: 'Created', message: string}|{status: 201, statusText: 'Created', message: string, createdRecord: object}>} Object with information about the attempted creation of the provided record (i.e., `status`, `statusText`, `message`, and `createdRecord` if the `options` argument was passed as `{ 'row': true }`). If `{ 'row': true }` is *not* specified as the third argument, then the response object will not have a `createRecord` property; if, however, `{ 'row': true }` is specified but the record was created in an underlying table but does not appear in the view itself, then `undefined` will be the value for the `createdRecord` property of the response object.
         * @since 1.0.0
         * @example
         * // create one record that remains in the view after creation (i.e., email of "oscarmartinez@google.com")
         * // create another record that ends up being filtered out of the view (i.e., email of "jimhalpert@google.com")
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function createViewRecord() {
         *   const newRecordObjGood = {
         *     First_Name: "Oscar",
         *     Last_Name: "Martinez",
         *     Email: "oscarmartinez@google.com",
         *     Account_Status: true
         *   }
         *   const newRecordObjBad = {
         *     First_Name: "Jim",
         *     Last_Name: "Halpert",
         *     Email: "jimhalpert@google.com",
         *     Account_Status: false
         *   }
         *   const VIEW_NAME = 'Demo_Physicians_Active';
         *   const createResultOne = await caspio.views.createRecord(VIEW_NAME, newRecordObjGood, { row: true });
         *   const createResultTwo = await caspio.views.createRecord(VIEW_NAME, newRecordObjBad, { row: true });
         *   console.log(createResultOne);
         *   console.log(createResultTwo);
         *   return [ createResultOne, createResultTwo ]
         * }
         *
         * createViewRecord();
         *
         * // example return value(s)
         * [
         *   {
         *     status: 201,
         *     statusText: 'Created',
         *     message: 'Record successfully created.',
         *     createdRecord: {
         *       Physician_ID: 'PVFHYYQH',
         *       Date_Created: null,
         *       First_Name: 'Oscar',
         *       Last_Name: 'Martinez',
         *       Full_Name: 'Oscar Martinez',
         *       Gender: '',
         *       Email: 'oscarmartinez@google.com',
         *       Account_Status: true,
         *       Profile_Status: false,
         *       Profile_Picture: null,
         *       Specialties: null,
         *       About_Section: '',
         *       Education_and_Training: '',
         *       Languages_Spoken: null,
         *       Office_Address: '',
         *       Office_City: '',
         *       Office_State: '',
         *       Office_Zip: '',
         *       Title: '',
         *       Accepting_New_Patients: false,
         *       Affiliations: '',
         *       Board_Certifications: '',
         *       Office_Name: '',
         *       Office_Phone: '',
         *       ViewCount: null
         *     }
         *   },
         *   {
         *     status: 201,
         *     statusText: 'Created',
         *     message: 'Record successfully created.',
         *     createdRecord: undefined
         *   }
         * ]
         */
        createRecord: async (viewName, recordValuesObj, options = { row: false }) => {
          try {
            if (!Object.prototype.hasOwnProperty.call(options, 'row')) {
              throw new Error('The third argument to the createRecord function must be an object with a \'row\' property. If the \'row\' property value is the boolean true, then the created record is returned; otherwise, the created record is not returned.');
            }
            const responseClause = options.row ? 'rows' : '';
            const theReq = await axios({
              method: 'post',
              url: `${baseURL}/v2/views/${viewName}/records?response=${responseClause}`,
              headers: caspioHeaders,
              data: recordValuesObj,
            });
            const { status, statusText, data: { Result: newRecordArr } } = theReq;
            const message = 'Record successfully created.';
            let responseObj;
            if (newRecordArr) {
              // a maximum of 1 record is ever returned
              const createdRecord = newRecordArr[0];
              responseObj = {
                status, statusText, message, createdRecord,
              };
            } else {
              responseObj = { status, statusText, message };
            }
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Deletes all records from `viewName` matched by `whereClause` (i.e., the provided `WHERE` clause). This method is generally not recommended due to the notes that follow. Directly deleting records in a *table* should always be the preferred route since deleting records in a view ultimately results in deleting records from a single underlying table.
         *
         * **Note (required conditions for deleting a record from a view):** Records may only be deleted in a view if the view itself only contains a single table or if a particular table in the view has been specified as *editable* within the view's configuration. This can be done by selecting a table under the *"Do you need to edit data using this View?"* question when editing a view within Caspio.
         *
         * @memberOf Views
         * @param {string} viewName Name of view (case-insensitive)
         * @param {string} whereClause `WHERE` clause (i.e., query to match records to be affected)
         * @returns {Promise<{status: 200, statusText: 'OK', message: string, recordsAffected: number}>} Object with information about the attempted deletion of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, and `recordsAffected`)
         * @since 1.0.0
         * @example
         * // Delete all records from the 'Demo_Physicians_Active' view
         * // that have an 'Email' field value of 'oscarmartinez@google.com'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function deleteRecordsFromView() {
         *   const whereClause = `Email = 'oscarmartinez@google.com'`;
         *   const VIEW_NAME = 'Demo_Physicians_Active';
         *   const deleteResult = await caspio.views.deleteRecords(VIEW_NAME, whereClause);
         *   console.log(deleteResult);
         *   return deleteResult;
         * }
         *
         * deleteRecordsFromView();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: '1 record(s) successfully deleted.',
         *   recordsAffected: 1
         * }
         */
        deleteRecords: async (viewName, whereClause) => {
          const processedWhereClause = _utils.whereClauseBuilder(whereClause);
          if (typeof processedWhereClause === 'string') {
            try {
              const theReq = await axios({
                method: 'delete',
                url: `${baseURL}/v2/views/${viewName}/records?q.where=${processedWhereClause}`,
                headers: caspioHeaders,
              });
              const { status, statusText, data: { RecordsAffected: recordsAffected } } = theReq;
              const message = `${recordsAffected} record(s) successfully deleted.`;
              const responseObj = {
                status, statusText, message, recordsAffected,
              };
              return responseObj;
            } catch (error) {
              if (axios.isAxiosError(error)) {
                _utils.axiosErrorHandler(error);
              } else {
                console.error(error);
              }
            }
          }
        },
      },
      /**
       * Methods for files.
       *
       * @namespace Files
       */
      files: {
        /**
         * Returns metadata specifically for a file or directory by *path*, `resourcePath` (i.e., instead of by a file or directory key). By default, metadata is requested for a *file*. This can be changed, however, by setting the `resourceType` property of the `options` object to `'d'` for *directory* (the default is `'f'` for *file*).
         *
         * @memberOf Files
         * @param {string} resourcePath Path to requested resource such as `/FolderOne/FolderTwo` for a directory or `/FolderOne/FolderTwo/myFile.png` for a file (case-sensitive)
         * @param {object} [options={ 'resourceType': 'f' }] Object with a `'resourceType'` key whose value should be either `'f'` for *file* or `'d'` for *directory* (defaults to `'f'`).
         * @returns {Promise<{Name: string, ExternalKey: string, ContentType: string, DateCreated: string}|{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string}>} An object with metadata strictly about the requested resource; that is, if `{ 'resourceType': 'f' }` is supplied as the `options` argument, which is the default, then metadata about a *file* will be returned (if found).
         *
         * Similarly, if `{ 'resourceType': 'd' }` is supplied as the `options` argument, then metadata about a *directory* or folder will be returned (if found).
         * @since 1.0.0
         * @example
         * // Get metadata for the '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder' directory
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getDirectoryMetadata() {
         *   const DIRECTORY_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
         *   const metadata = await caspio.files.metadataByPath(DIRECTORY_PATH, { resourceType: 'd' });
         *   console.log(metadata);
         *   return metadata;
         * }
         *
         * getDirectoryMetadata();
         *
         * // sample return value
         * {
         *   Name: 'Demo_Subfolder_One_Subfolder',
         *   ExternalKey: '6b8dc1eb-8c38-4512-8040-8a847e478778',
         *   ContentType: 'caspio/folder',
         *   DateCreated: '1/12/2022 7:15:18 AM'
         * }
         *
         * @example
         * // Get metadata for the '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/dsos1.png' file
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getFileMetadata() {
         *   const FILE_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/dsos1.png';
         *   const metadata = await caspio.files.metadataByPath(FILE_PATH, { resourceType: 'f' });
         *   console.log(metadata);
         *   return metadata;
         * }
         *
         * getFileMetadata();
         *
         * // sample return value
         * {
         *   Name: 'dsos1.png',
         *   ExternalKey: 'c92e471f-8cd1-49ce-b5d5-2c88bf0ab045',
         *   Size: 1449,
         *   LastModified: '1/28/2022 3:31:42 PM',
         *   ContentType: 'image/png',
         *   DateCreated: '1/24/2022 8:30:51 PM'
         * }
         */
        metadataByPath: async (resourcePath, options = { resourceType: 'f' }) => {
          try {
            const metadata = await _utils.fileOrDirectoryMetadata(resourcePath, options);
            return metadata;
          } catch (error) {
            console.error(error);
          }
        },
        /**
         * Returns metadata for file(s) and folder(s) based on the `externalKey` provided. Specifically, returns an object with `Folders` and `Files` as keys whose values are arrays whose elements are metadata objects concerning those folders or files, respectively.
         *
         * If `externalKey` is empty (i.e., the default value), then the list of files and folders of the root folder is returned.
         *
         * If `externalKey` belongs to a folder, then the list of files and folders from the specified folder is returned.
         *
         * If `externalKey` belongs to a file, then an object of the form `{ "Folders": [], "Files": [ {...} ] }` is returned, where `{ ... }` refers to the single file identified by `externalKey`.
         *
         * @memberOf Files
         * @param {string} [externalKey=''] Folder or file ID
         * @returns {Promise<{Folders: Array.<{Name: string, ExternalKey: string, ContentType: string, DateCreated: string}>, Files: Array.<{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string}>}>} Object with metadata concerning folders and files
         * @since 1.0.0
         * @example
         * // get the files and folders in the 'Demo_Sandbox' folder
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getFolderMetadata() {
         *   // the key below is for the 'Demo_Sandbox' folder
         *   const FILE_FOLDER_ID = "c5b7f134-dcd0-4c34-bba3-34129ee6e9eb";
         *   const metadata = await caspio.files.metadataByKey(FILE_FOLDER_ID);
         *   console.log(metadata);
         *   return metadata;
         * }
         *
         * getFolderMetadata();
         *
         * // sample return value
         * {
         *   Folders: [
         *     {
         *       Name: 'Demo_Subfolder_One',
         *       ExternalKey: '4e2ed81b-b9af-4116-852f-c7cc29cda6a1',
         *       ContentType: 'caspio/folder',
         *       DateCreated: '1/12/2022 7:14:50 AM'
         *     },
         *     {
         *       Name: 'Demo_Subfolder_Two',
         *       ExternalKey: '86eccfcc-e295-405f-978c-3e06495b3d82',
         *       ContentType: 'caspio/folder',
         *       DateCreated: '1/12/2022 7:14:01 AM'
         *     }
         *   ],
         *   Files: [
         *     {
         *       Name: 'ds1.png',
         *       ExternalKey: 'b0bd9207-06e2-4932-8c1a-97aff5c93ae5',
         *       Size: 1449,
         *       LastModified: '1/28/2022 3:31:03 PM',
         *       ContentType: 'image/png',
         *       DateCreated: '1/12/2022 7:16:58 AM'
         *     }
         *   ]
         * }
         */
        metadataByKey: async (externalKey = '') => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/files?externalKey=${externalKey}`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Uploads or overwrites one file into the Caspio's account's Files area. A file is only overwritten if a file of the same name exists in the upload destination. The file to upload is specified by `srcFilePath`, the destination of the upload directory as `destDirPath`, and finally whether or not the original file name should be saved as a different file name upon upload, `newFileNameNoExt` (by default, the original file name is used).
         *
         * @memberOf Files
         * @param {string} srcFilePath Path of the file to be uploaded
         * @param {string} [destDirPath=''] Upload destination by path (i.e., the path of the destination folder). If `destDirPath` is not provided, then the file is uploaded to the root folder (i.e., `/`).
         * @param {string} [newFileNameNoExt=''] New name for the file to be uploaded (almost like a "Save As" option). It should *not* contain the file extension--this will be deduced from the first argument, `srcFilePath`. The default value is an empty string, `''`, which will be used to indicate no new name has been specified.
         * @returns {Promise<{status: (200|201), statusText: ('OK'|'Created'), message: string, Name: string, ExternalKey: string}>} Object with information about the upload attempt (i.e., `status`, `statusText`, `message`, `Name`, and `ExternalKey`, where `Name` represents the name of the uploaded file and `ExternalKey` the file's assigned ID). If the `status` value is `200`, then a file of the same name in the same location was overwritten. If the `status` value is `200` (with `statusText` of `'OK'`), then a file of the same name in the same location was overwritten. If the status value is `201` (with `statusText` of `'Created'`), then the file was uploaded without any other file being overwritten.
         * @since 1.0.0
         * @example
         * // uploads a local file 'somefile2.png' to the Files area as 'dsos2.png' in the folder with
         * // full path '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder'
         * // this results in creating a new file (i.e., no file is overwritten)
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadOrOverwriteFile() {
         *   const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
         *   const uploadResult = await caspio.files.uploadOverwriteByPath('./somefile2.png', FOLDER_PATH, 'dsos2');
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadOrOverwriteFile();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: "File 'dsos2.png' uploaded successfully. No file was overwritten.",
         *   Name: 'dsos2.png',
         *   ExternalKey: 'ad2c32c8-ae5a-41d9-885c-5f31f0d3a748'
         * }
         *
         * @example
         * // upload the local file 'somefile2.png' to the Files area as 'dsos2.png' in the folder with
         * // full path '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder'
         * // this results in overwriting the 'dsos2.png' file that was added in the previous example
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadOrOverwriteFile() {
         *   const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
         *   const uploadResult = await caspio.files.uploadOverwriteByPath('./somefile2.png', FOLDER_PATH, 'dsos2');
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadOrOverwriteFile();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "File 'dsos2.png' uploaded successfully. Another file of the same name in the same location was overwritten.",
         *   Name: 'dsos2.png',
         *   ExternalKey: 'ad2c32c8-ae5a-41d9-885c-5f31f0d3a748'
         * }
         */
        uploadOverwriteByPath: async (srcFilePath, destDirPath = '', newFileNameNoExt = '') => {
          try {
            let destDir;
            let destDirKey;
            if (destDirPath === '' || destDirPath === '/') {
              destDirKey = '';
            } else {
              destDir = await _utils.fileOrDirectoryMetadata(destDirPath, { resourceType: 'd' });
              if (destDir) {
                destDirKey = destDir.ExternalKey;
              } else {
                return false;
              }
            }
            const formWithFile = new FormData({ maxDataSize: Infinity });
            let filename = path.basename(srcFilePath);
            if (newFileNameNoExt) {
              filename = newFileNameNoExt + path.extname(srcFilePath);
            }
            formWithFile.append('file', fs.createReadStream(srcFilePath), { filename });
            const headersFromForm = formWithFile.getHeaders();
            const caspioHeadersCopy = { ...caspioHeaders };
            const updatedCaspioHeaders = Object.assign(caspioHeadersCopy, headersFromForm);
            const theReq = await axios({
              method: 'put',
              url: `${baseURL}/v2/files?externalKey=${destDirKey}`,
              headers: updatedCaspioHeaders,
              data: formWithFile,
            });
            const { status, statusText, data: { Result: { Name, ExternalKey } } } = theReq;
            let message;
            if (statusText === 'OK') {
              message = `File '${filename}' uploaded successfully. Another file of the same name in the same location was overwritten.`;
            } else if (statusText === 'Created') {
              message = `File '${filename}' uploaded successfully. No file was overwritten.`;
            }
            const responseObj = {
              status, statusText, message, Name, ExternalKey,
            };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Uploads or overwrites one file into the Caspio's account's Files area. A file is only overwritten if a file of the same name exists in the upload destination. The file to upload is specified by `srcFilePath`, the destination of the upload directory as `externalKey` (i.e., Folder ID of destination folder), and finally whether or not the original file name should be saved as a different file name upon upload, `newFileNameNoExt` (by default, the original file name is used).
         *
         * @memberOf Files
         * @param {string} srcFilePath Path of the file to be uploaded
         * @param {string} [externalKey=''] Upload destination by key (i.e., the ID of the destination folder). If `externalKey` is not provided, then the file is uploaded to the root folder (i.e., `/`).
         * @param {string} [newFileNameNoExt=''] New name for the file to be uploaded (almost like a "Save As" option). It should *not* contain the file extension--this will be deduced from the first argument, `srcFilePath`. The default value is an empty string, `''`, which will be used to indicate no new name has been specified.
         * @returns {Promise<{status: (200|201), statusText: ('OK'|'Created'), message: string, Name: string, ExternalKey: string}>} Object with information about the upload attempt (i.e., `status`, `statusText`, `message`, `Name`, and `ExternalKey`, where `Name` represents the name of the uploaded file and `ExternalKey` the file's assigned ID). If the `status` value is `200` (with `statusText` of `'OK'`), then a file of the same name in the same location was overwritten. If the status value is `201` (with `statusText` of `'Created'`), then the file was uploaded without any other file being overwritten.
         * @since 1.0.0
         * @example
         * // upload the local file 'somefile1.png' to the Files area as 'dsos2.png' in the folder with
         * // a key of '6b8dc1eb-8c38-4512-8040-8a847e478778' (i.e., 'Demo_Subfolder_One_Subfolder')
         * // this results in creating a new file (i.e., no file is overwritten)
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadOrOverwriteFile() {
         *   const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
         *   const uploadResult = await caspio.files.uploadOverwriteByKey('./somefile1.png', FOLDER_ID, 'dsos2');
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadOrOverwriteFile();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: "File 'dsos2.png' uploaded successfully. No file was overwritten.",
         *   Name: 'dsos2.png',
         *   ExternalKey: '59f9f6d1-531d-460e-af57-458c2df2cfc6'
         * }
         *
         * @example
         * // upload the local file 'somefile2.png' to the Files area as 'dsos2.png' in the folder with
         * // a key of '6b8dc1eb-8c38-4512-8040-8a847e478778' (i.e., 'Demo_Subfolder_One_Subfolder')
         * // this results in overwriting the 'dsos2.png' file that was added in the previous example
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadOrOverwriteFile() {
         *   const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
         *   const uploadResult = await caspio.files.uploadOverwriteByKey('./somefile2.png', FOLDER_ID, 'dsos2');
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadOrOverwriteFile();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "File 'dsos2.png' uploaded successfully. Another file of the same name in the same location was overwritten.",
         *   Name: 'dsos2.png',
         *   ExternalKey: '59f9f6d1-531d-460e-af57-458c2df2cfc6'
         * }
         */
        uploadOverwriteByKey: async (srcFilePath, externalKey = '', newFileNameNoExt = '') => {
          try {
            const formWithFile = new FormData({ maxDataSize: Infinity });
            let filename = path.basename(srcFilePath);
            if (newFileNameNoExt) {
              filename = newFileNameNoExt + path.extname(srcFilePath);
            }
            formWithFile.append('file', fs.createReadStream(srcFilePath), { filename });
            const headersFromForm = formWithFile.getHeaders();
            const caspioHeadersCopy = { ...caspioHeaders };
            const updatedCaspioHeaders = Object.assign(caspioHeadersCopy, headersFromForm);
            const theReq = await axios({
              method: 'put',
              url: `${baseURL}/v2/files?externalKey=${externalKey}`,
              headers: updatedCaspioHeaders,
              data: formWithFile,
            });
            const { status, statusText, data: { Result: { Name, ExternalKey } } } = theReq;
            let message;
            if (statusText === 'OK') {
              message = `File '${filename}' uploaded successfully. Another file of the same name in the same location was overwritten.`;
            } else if (statusText === 'Created') {
              message = `File '${filename}' uploaded successfully. No file was overwritten.`;
            }
            const responseObj = {
              status, statusText, message, Name, ExternalKey,
            };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Uploads one or more files into the Files area of a Caspio account. Specifically, an array of one or more elements (i.e., `srcFilePathsArr`) is specified as the file(s) to be uploaded, where `destDirPath` specifies the path to the directory where files should be uploaded.
         *
         * @memberOf Files
         * @param {Array.<string|Array.<string, string>>} srcFilePathsArr An array consisting of strings and/or 2-element subarrays. If the element is a string, then the element should be the path to the file to be uploaded (i.e., where the name of the uploaded file will be the name of the original file); if, however, the element is a 2-element array, the first element should be the file path to the file to be uploaded, and the second element should be the new name of the file *without* an extension (sort of like a "Save As"), where the extension is deduced from the first element of the 2-element array. Example argument: `['./pathToFileNameUnchanged.png', [ './pathToFileWithUndesiredName.png', 'fileNameReallyDesired' ]]`.
         *
         * If an attempt is made to upload a file with the same name as a currently existing file, then this attempt is aborted. If *all* attempts are aborted, then the Caspio server throws an error.
         * @param {string} [destDirPath=''] Upload destination by path (i.e., the path of the destination folder). If `destDirPath` is not provided, then the file is uploaded to the root folder (i.e., `/`).
         * @returns {Promise<{status: 201, statusText: 'Created', message: string, uploadedFiles: Array.<{Name: string, ExternalKey: string}>}>} Object with information about the attempted file(s) upload to the folder specified by `externalKey` (i.e., `status`, `statusText`, `message`, and `uploadedFiles`).
         * @since 1.0.0
         * @example
         * // upload multiple files to a directory where original and new names are used for the uploaded files
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadFiles() {
         *   const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
         *   const FILES_ARRAY = ['./somefile1.png', ['./somefile2.png', 'myCoolSecondFile'], './somefile3.png'];
         *   const uploadResult = await caspio.files.uploadByPath(FILES_ARRAY, FOLDER_PATH);
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadFiles();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
         *   uploadedFiles: [
         *     {
         *       Name: 'somefile1.png',
         *       ExternalKey: '2098314a-7a3d-4721-aa87-42f72dfce8b9'
         *     },
         *     {
         *       Name: 'myCoolSecondFile.png',
         *       ExternalKey: '06d55aaa-86e3-4392-a052-6def82380a77'
         *     },
         *     {
         *       Name: 'somefile3.png',
         *       ExternalKey: '070e2b77-efca-4ba5-b3e8-7868dd3d2091'
         *     }
         *   ]
         * }
         *
         * @example
         * // attempt upload of multiple files to a directory resulting in only one file being uploaded
         * // since the other two files already exist in the same location by the same name
         * // (assumes example above was used prior to this example)
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadFiles() {
         *   const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
         *   const FILES_ARRAY = ['./somefile1.png', './somefile2.png', './somefile3.png'];
         *   const uploadResult = await caspio.files.uploadByPath(FILES_ARRAY, FOLDER_PATH);
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadFiles();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
         *   uploadedFiles: [
         *     {
         *       Name: 'somefile2.png',
         *       ExternalKey: 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e'
         *     }
         *   ]
         * }
         */
        uploadByPath: async (srcFilePathsArr, destDirPath = '') => {
          try {
            let destDir;
            let destDirKey;
            if (destDirPath === '' || destDirPath === '/') {
              destDirKey = '';
            } else {
              destDir = await _utils.fileOrDirectoryMetadata(destDirPath, { resourceType: 'd' });
              if (destDir) {
                destDirKey = destDir.ExternalKey;
              } else {
                return false;
              }
            }
            const formWithFiles = new FormData({ maxDataSize: Infinity });
            let filename;
            for (let i = 0; i < srcFilePathsArr.length; i++) {
              const fileInfo = srcFilePathsArr[i];
              if (Array.isArray(fileInfo) && fileInfo.length === 2) {
                if ((typeof fileInfo[0] === 'string') && (typeof fileInfo[1] === 'string')) {
                  filename = fileInfo[1] + path.extname(fileInfo[0]);
                  formWithFiles.append(`file${i}`, fs.createReadStream(fileInfo[0]), { filename });
                } else {
                  throw new Error('Each element of the 2-element subarray must be a string, the first element being a valid file path source and the second being a new name for the file without an extension.');
                }
              } else if (typeof fileInfo === 'string') {
                filename = path.basename(fileInfo);
                formWithFiles.append(`file${i}`, fs.createReadStream(fileInfo), { filename });
              } else {
                throw new Error('The first argument provided to the uploadByKey function for files must be an array consisting of a combination of file path source strings (Example: \'./some_dir/some_file.png\') and 2-element subarrays with the first element being the file path source string and the second element the new file name without an extension (Example: [ \'./some_dir/some_file.png\', \'some_file_new_name\' ]).');
              }
            }
            const headersFromForm = formWithFiles.getHeaders();
            const caspioHeadersCopy = { ...caspioHeaders };
            const updatedCaspioHeaders = Object.assign(caspioHeadersCopy, headersFromForm);
            const theReq = await axios({
              method: 'post',
              url: `${baseURL}/v2/files?externalKey=${destDirKey}`,
              headers: updatedCaspioHeaders,
              data: formWithFiles,
            });
            const { status, statusText, data: { Result: uploadedFiles } } = theReq;
            const message = 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.';
            const responseObj = {
              status, statusText, message, uploadedFiles,
            };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Uploads one or more files into the Files area of a Caspio account. Specifically, an array of one or more elements (i.e., `srcFilePathsArr`) is specified as the file(s) to be uploaded, where `externalKey` specifies the Folder ID of the directory where files should be uploaded.
         *
         * @memberOf Files
         * @param {Array.<string|Array.<string, string>>} srcFilePathsArr An array consisting of strings and/or 2-element subarrays. If the element is a string, then the element should be the path to the file to be uploaded (i.e., where the name of the uploaded file will be the name of the original file); if, however, the element is a 2-element array, the first element should be the file path to the file to be uploaded, and the second element should be the new name of the file *without* an extension (sort of like a "Save As"), where the extension is deduced from the first element of the 2-element array. Example argument: `['./pathToFileNameUnchanged.png', [ './pathToFileWithUndesiredName.png', 'fileNameReallyDesired' ]]`.
         *
         * If an attempt is made to upload a file with the same name as a currently existing file, then this attempt is aborted. If *all* attempts are aborted, then the Caspio server throws an error.
         * @param {string} [externalKey=''] Upload destination by key (i.e., the ID of the destination folder). If `externalKey` is not provided, then the file is uploaded to the root folder (i.e., `/`).
         * @returns {Promise<{status: 201, statusText: 'Created', message: string, uploadedFiles: Array.<{Name: string, ExternalKey: string}>}>} Object with information about the attempted file(s) upload to the folder specified by `externalKey` (i.e., `status`, `statusText`, `message`, and `uploadedFiles`).
         * @since 1.0.0
         * @example
         * // upload multiple files to a directory where original and new names are used for the uploaded files
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadFiles() {
         *   const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
         *   const FILES_ARRAY = ['./somefile1.png', ['./somefile2.png', 'myCoolSecondFile'], './somefile3.png'];
         *   const uploadResult = await caspio.files.uploadByKey(FILES_ARRAY, FOLDER_ID);
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadFiles();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
         *   uploadedFiles: [
         *     {
         *       Name: 'somefile1.png',
         *       ExternalKey: '8337a0b4-e314-4e82-a0ee-4ea2e1e8b38b'
         *     },
         *     {
         *       Name: 'myCoolSecondFile.png',
         *       ExternalKey: 'ab9c2d44-71a4-4218-977d-62aedc21bb53'
         *     },
         *     {
         *       Name: 'somefile3.png',
         *       ExternalKey: '452d659c-319c-4ebc-95f1-a2a49cc6a97a'
         *     }
         *   ]
         * }
         *
         * @example
         * // attempt upload of multiple files to a directory resulting in only one file being uploaded
         * // since the other two files already exist in the same location by the same name
         * // (assumes example above was used prior to this example)
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function uploadFiles() {
         *   const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
         *   const FILES_ARRAY = ['./somefile1.png', './somefile2.png', './somefile3.png'];
         *   const uploadResult = await caspio.files.uploadByKey(FILES_ARRAY, FOLDER_ID);
         *   console.log(uploadResult);
         *   return uploadResult;
         * }
         *
         * uploadFiles();
         *
         * // sample return value
         * {
         *   status: 201,
         *   statusText: 'Created',
         *   message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
         *   uploadedFiles: [
         *     {
         *       Name: 'somefile2.png',
         *       ExternalKey: 'f9d70ed7-1cce-425b-87b7-914a743da5af'
         *     }
         *   ]
         * }
         */
        uploadByKey: async (srcFilePathsArr, externalKey = '') => {
          try {
            const formWithFiles = new FormData({ maxDataSize: Infinity });
            let filename;
            for (let i = 0; i < srcFilePathsArr.length; i++) {
              const fileInfo = srcFilePathsArr[i];
              if (Array.isArray(fileInfo) && fileInfo.length === 2) {
                if ((typeof fileInfo[0] === 'string') && (typeof fileInfo[1] === 'string')) {
                  filename = fileInfo[1] + path.extname(fileInfo[0]);
                  formWithFiles.append(`file${i}`, fs.createReadStream(fileInfo[0]), { filename });
                } else {
                  throw new Error('Each element of the 2-element subarray must be a string, the first element being a valid file path source and the second being a new name for the file without an extension.');
                }
              } else if (typeof fileInfo === 'string') {
                filename = path.basename(fileInfo);
                formWithFiles.append(`file${i}`, fs.createReadStream(fileInfo), { filename });
              } else {
                throw new Error('The first argument provided to the uploadByKey function for files must be an array consisting of a combination of file path source strings (Example: \'./some_dir/some_file.png\') and 2-element subarrays with the first element being the file path source string and the second element the new file name without an extension (Example: [ \'./some_dir/some_file.png\', \'some_file_new_name\' ]).');
              }
            }
            const headersFromForm = formWithFiles.getHeaders();
            const caspioHeadersCopy = { ...caspioHeaders };
            const updatedCaspioHeaders = Object.assign(caspioHeadersCopy, headersFromForm);
            const theReq = await axios({
              method: 'post',
              url: `${baseURL}/v2/files?externalKey=${externalKey}`,
              headers: updatedCaspioHeaders,
              data: formWithFiles,
            });
            const { status, statusText, data: { Result: uploadedFiles } } = theReq;
            const message = 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.';
            const responseObj = {
              status, statusText, message, uploadedFiles,
            };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Downloads file content as an attachment, where `filePath` specifies the location of the file to be downloaded and `saveAsWithoutExt`, if provided, specifies what the file's name should be upon download (the default name is that of the file being downloaded).
         *
         * @memberOf Files
         * @param {string} filePath Path to file
         * @param {string} [saveAsWithoutExt=''] Name to save file as (the extension should *not* be specified as this will be deduced by the content type of the file during download). If this argument is not provided, then the original file name is used.
         * @returns {Promise<{status: (200|403|404), statusText: ('OK'|'Forbidden'|'NotFound'), message: string}>} Object with information about the attempted file download (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // download file '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile2.png'
         * // and save as '/Users/someuser/Desktop/myFile.png'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function downloadFile() {
         *   const FILE_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile2.png';
         *   const SAVE_AS = '/Users/someuser/Desktop/myFile';
         *   const downloadResult = await caspio.files.downloadByPath(FILE_PATH, SAVE_AS);
         *   console.log(downloadResult);
         *   return downloadResult;
         * }
         *
         * downloadFile();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "File '/Users/someuser/Desktop/myFile.png' successfully downloaded."
         * }
         */
        downloadByPath: async (filePath, saveAsWithoutExt = '') => {
          try {
            const fileData = await _utils.fileOrDirectoryMetadata(filePath, { resourceType: 'f' });
            if (!fileData) {
              return false;
            }
            const { Name: fileName, ExternalKey: fileKey } = fileData;

            let fileNameForDownload;
            if (saveAsWithoutExt) {
              const fileExt = path.extname(fileName);
              fileNameForDownload = saveAsWithoutExt + fileExt;
            } else {
              fileNameForDownload = fileName;
            }
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/files/${fileKey}`,
              headers: caspioHeaders,
              responseType: 'stream',
            });
            await theReq.data.pipe(fs.createWriteStream(fileNameForDownload));
            const { status, statusText } = theReq;
            const message = `File '${fileNameForDownload}' successfully downloaded.`;
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Downloads file content as an attachment, where `externalKey` specifies the File ID of the file to be downloaded and `saveAsWithoutExt`, if provided, specifies what the file's name should be upon download (the default name is that of the file being downloaded).
         *
         * @memberOf Files
         * @param {string} externalKey File ID
         * @param {string} [saveAsWithoutExt=''] Name to save file as (the extension should *not* be specified as this will be deduced by the content type of the file during download). If this argument is not provided, then the original file name is used.
         * @returns {Promise<{status: (200|403|404), statusText: ('OK'|'Forbidden'|'NotFound'), message: string}>} Object with information about the attempted file download (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // download file with File ID of 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e'
         * // and save as '/Users/someuser/Desktop/myFile.<extension-of-downloaded-file>'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function downloadFile() {
         *   const FILE_ID = 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e';
         *   const SAVE_AS = '/Users/someuser/Desktop/myFile';
         *   const downloadResult = await caspio.files.downloadByKey(FILE_ID, SAVE_AS);
         *   console.log(downloadResult);
         *   return downloadResult;
         * }
         *
         * downloadFile();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "File '/Users/someuser/Desktop/myFile.png' successfully downloaded."
         * }
         */
        downloadByKey: async (externalKey, saveAsWithoutExt = '') => {
          try {
            let fileNameForDownload;
            let fileName;
            const fileData = await _utils.fileMetadataByKey(externalKey);

            if (fileData && fileData.Files.length > 0) {
              fileName = fileData.Files[0].Name;
            } else {
              throw new Error(`The external key '${externalKey}' does not match a currently existing file. Please try again.`);
            }

            if (saveAsWithoutExt) {
              const fileExt = path.extname(fileName);
              fileNameForDownload = saveAsWithoutExt + fileExt;
            } else {
              fileNameForDownload = fileName;
            }
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/files/${externalKey}`,
              headers: caspioHeaders,
              responseType: 'stream',
            });
            await theReq.data.pipe(fs.createWriteStream(fileNameForDownload));
            const { status, statusText } = theReq;
            const message = `File '${fileNameForDownload}' successfully downloaded.`;
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Deletes a file, where `filePath` specifies the location of the file to be deleted.
         *
         * @memberOf Files
         * @param {string} filePath Path to file
         * @returns {Promise<{status: (200|403|404), statusText: ('OK'|'Forbidden'|'NotFound'), message: string}>} Object with information about the attempted file deletion (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // deletes file with full path of '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile1.png'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function deleteFile() {
         *   const FILE_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile1.png';
         *   const deleteResult = await caspio.files.deleteByPath(FILE_PATH);
         *   console.log(deleteResult);
         *   return deleteResult;
         * }
         *
         * deleteFile();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "File 'somefile1.png' successfully deleted."
         * }
         */
        deleteByPath: async (filePath) => {
          const fileData = await _utils.fileOrDirectoryMetadata(filePath, { resourceType: 'f' });
          if (!fileData) {
            return false;
          }
          const { Name: fileName, ExternalKey: fileKey } = fileData;
          try {
            const theReq = await axios({
              method: 'delete',
              url: `${baseURL}/v2/files/${fileKey}`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = `File '${fileName}' successfully deleted.`;
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Deletes a file, where `externalKey` specifies the File ID of the file to be deleted.
         *
         * @memberOf Files
         * @param {string} externalKey File ID
         * @returns {Promise<{status: (200|403|404), statusText: ('OK'|'Forbidden'|'NotFound'), message: string}>} Object with information about the attempted file deletion (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // delete the file with File ID of 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function deleteFile() {
         *   const FILE_ID = 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e';
         *   const deleteResult = await caspio.files.deleteByKey(FILE_ID);
         *   console.log(deleteResult);
         *   return deleteResult;
         * }
         *
         * deleteFile();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: 'File successfully deleted.'
         * }
         */
        deleteByKey: async (externalKey) => {
          try {
            const theReq = await axios({
              method: 'delete',
              url: `${baseURL}/v2/files/${externalKey}`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = 'File successfully deleted.';
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
      },
      /**
       * Methods for tasks.
       *
       * @namespace Tasks
       */
      tasks: {
        /**
         * Returns the list of scheduled tasks for a Caspio account.
         *
         * @memberOf Tasks
         * @returns {Promise<Array<{LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}>>} Array of objects where each object contains properties of a scheduled task
         * @since 1.0.0
         * @example
         * // get list of all scheduled tasks for a Caspio account
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getScheduledTasks() {
         *   const scheduledTasks = await caspio.tasks.listing();
         *   console.log(scheduledTasks);
         *   return scheduledTasks;
         * }
         *
         * getScheduledTasks();
         *
         * // sample return value
         * [
         *   ...,
         *   {
         *     LastRunTimeUTC: '2022-01-29T06:49:07',
         *     LastRunTime: '2022-01-29T06:49:07',
         *     Success: true,
         *     Name: 'Demo_Physicians_Export',
         *     ExternalKey: 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157',
         *     Status: 'Ready',
         *     TaskTimeZone: 'UTC',
         *     Frequency: '1 of the month',
         *     Note: ''
         *   },
         *   ...
         * ]
         */
        listing: async () => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/tasks`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns properties of `taskName`, a scheduled task.
         *
         * @memberOf Tasks
         * @param {string} taskName Task name
         * @returns {Promise<{LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}>} Object containing properties of the specified scheduled task
         * @since 1.0.0
         * @example
         * // get properties of the task with name 'Demo_Physicians_Export'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getTaskProperties() {
         *   const TASK_NAME = 'Demo_Physicians_Export';
         *   const taskProperties = await caspio.tasks.propertiesByName(TASK_NAME);
         *   console.log(taskProperties);
         *   return taskProperties;
         * }
         *
         * getTaskProperties();
         *
         * // sample return value
         * {
         *   LastRunTimeUTC: '2022-01-29T06:49:07',
         *   LastRunTime: '2022-01-29T06:49:07',
         *   Success: true,
         *   Name: 'Demo_Physicians_Export',
         *   ExternalKey: 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157',
         *   Status: 'Ready',
         *   TaskTimeZone: 'UTC',
         *   Frequency: '1 of the month',
         *   Note: ''
         * }
         */
        propertiesByName: async (taskName) => {
          try {
            const lcTaskName = taskName.toLowerCase();
            const allTasks = await _utils.taskKeysGivenTaskNames();
            const foundTask = allTasks.find((task) => lcTaskName === task.Name.toLowerCase());
            if (foundTask) {
              const externalKey = foundTask[foundTask.Name];
              const theReq = await axios({
                method: 'get',
                url: `${baseURL}/v2/tasks/${externalKey}`,
                headers: caspioHeaders,
              });
              return theReq.data.Result;
            }
            throw new Error(`'${taskName}' does not exist. Please try again.`);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Returns properties of the task whose Task ID is `externalKey`.
         *
         * @memberOf Tasks
         * @param {string} externalKey Task ID
         * @returns {Promise<{LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}>} Object containing properties of the specified scheduled task
         * @since 1.0.0
         * @example
         * // returns properties of the task whose Task ID is 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function getTaskProperties() {
         *   const TASK_ID = 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157';
         *   const taskProperties = await caspio.tasks.propertiesByKey(TASK_ID);
         *   console.log(taskProperties);
         *   return taskProperties;
         * }
         *
         * getTaskProperties();
         *
         * // sample return value
         * {
         *   LastRunTimeUTC: '2022-01-29T06:49:07',
         *   LastRunTime: '2022-01-29T06:49:07',
         *   Success: true,
         *   Name: 'Demo_Physicians_Export',
         *   ExternalKey: 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157',
         *   Status: 'Ready',
         *   TaskTimeZone: 'UTC',
         *   Frequency: '1 of the month',
         *   Note: ''
         * }
         */
        propertiesByKey: async (externalKey) => {
          try {
            const theReq = await axios({
              method: 'get',
              url: `${baseURL}/v2/tasks/${externalKey}`,
              headers: caspioHeaders,
            });
            return theReq.data.Result;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Runs the scheduled task with name `taskName`.
         *
         * @memberOf Tasks
         * @param {string} taskName Task name
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about attempted running of the scheduled task (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // runs the 'Demo_Physicians_Export' scheduled task
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function runTask() {
         *   const TASK_NAME = 'Demo_Physicians_Export';
         *   const taskResult = await caspio.tasks.runByName(TASK_NAME);
         *   console.log(taskResult);
         *   return taskResult;
         * }
         *
         * runTask();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: "Task 'Demo_Physicians_Export' ran successfully."
         * }
         */
        runByName: async (taskName) => {
          try {
            const lowerCaseTaskName = taskName.toLowerCase();
            const allTasks = await _utils.taskKeysGivenTaskNames();
            const foundTask = allTasks.find((task) => lowerCaseTaskName === task.Name.toLowerCase());
            if (foundTask) {
              const externalKey = foundTask[foundTask.Name];
              const theReq = await axios({
                method: 'post',
                url: `${baseURL}/v2/tasks/${externalKey}/run`,
                headers: caspioHeaders,
              });
              const { status, statusText } = theReq;
              const message = `Task '${foundTask.Name}' ran successfully.`;
              const responseObj = { status, statusText, message };
              return responseObj;
            }
            throw new Error(`'${taskName}' does not exist. Please try again.`);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
        /**
         * Runs the scheduled task whose Task ID is `externalKey`.
         *
         * @memberOf Tasks
         * @param {string} externalKey Task ID
         * @returns {Promise<{status: 200, statusText: 'OK', message: string}>} Object with information about attempted running of the scheduled task (i.e., `status`, `statusText`, and `message`).
         * @since 1.0.0
         * @example
         * // runs the scheduled task whose Task ID is 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157'
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * async function runTask() {
         *   const TASK_ID = 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157';
         *   const taskResult = await caspio.tasks.runByKey(TASK_ID);
         *   console.log(taskResult);
         *   return taskResult;
         * }
         *
         * runTask();
         *
         * // sample return value
         * {
         *   status: 200,
         *   statusText: 'OK',
         *   message: 'Task ran successfully.'
         * }
         */
        runByKey: async (externalKey) => {
          try {
            const theReq = await axios({
              method: 'post',
              url: `${baseURL}/v2/tasks/${externalKey}/run`,
              headers: caspioHeaders,
            });
            const { status, statusText } = theReq;
            const message = 'Task ran successfully.';
            const responseObj = { status, statusText, message };
            return responseObj;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              _utils.axiosErrorHandler(error);
            } else {
              console.error(error);
            }
          }
        },
      },
      /**
       * Utility methods. More coming soon.
       *
       * @namespace Utilities
       */
      utils: {
        /**
         * Copies a record from table `tableName` by identifying a copy source (i.e., a single record matched by a `WHERE` clause, `whereClauseToFindRecord`) and then creating the same or slightly modified record in table `tableName`.
         *
         * The record that servers as a copy source may have its field values updated/changed by providing an object, `recPropUpdateObj`, which should have as its keys the field names in need of value updates and key values as the desired new values. Only fields that are editable should be specified in `recPropUpdateObj` (i.e., you cannot change or update a field that has a `Type` of `'AUTONUMBER'`, a formula field, etc.).
         *
         * @memberOf Utilities
         * @param {string} tableName Name of table (case-insensitive)
         * @param {string} whereClauseToFindRecord `WHERE` clause to unambiguously determine the record to be copied. If no record is found, then an error is thrown to indicate this. If more than one record is found, then an error is thrown to indicate that a record could not be unambiguously copied.
         * @param {object} [recPropUpdateObj={}] Object with key-value pairs in the form `<fieldName>:<newFieldValue>` where `fieldName` is the `Name` of a field from table `tableName` and `newFieldValue` is a *new* or *modified* value to be used for the newly copied record instead of the original value(s) from the copy source.
         *
         * This object effectively allows you to change, modify, or update editable values from the copy source before creating the copied/modified record. Attempting to write to read-only fields (e.g., fields with type `'TIMESTAMP'`, `'AUTONUMBER'`, etc., or formula fields) will cause an error.
         * @returns {Promise<Object>} The copied record
         * @since 1.0.0
         * @example
         * // Copy a record and change some of its values
         * const caspio = require('caspio-sdk')(caspioCredentials);
         *
         * // original record corresponding to email 'Lelah.Hoppe@gmail.com' appears below
         * // we want to copy this record but change values for a few fields:
         * // `First_Name`, `Last_Name`, `Title`, `Email`, `Profile_Photo`, `About_Section`
         * // (note that the `Password` field value cannot be copied)
         * const lelahRecord = {
         *   Physician_ID: '6T2C9HW8',
         *   Date_Created: '2020-10-07T04:54:19',
         *   First_Name: 'Lelah',
         *   Last_Name: 'Hoppe',
         *   Title: 'Adolescent Medicine Specialist',
         *   Full_Name: 'Lelah Hoppe',
         *   Gender: 'Other',
         *   Email: 'Lelah.Hoppe@gmail.com',
         *   Account_Status: true,
         *   Profile_Status: false,
         *   Profile_Photo: '/Demo/LelahHoppe.png',
         *   Specialties: {
         *     '3': 'Family Medicine',
         *     '6': 'Obstetrics and Gynecology',
         *     '8': 'Pain Management',
         *     '9': 'Pathology'
         *   },
         *   Accepting_New_Patients: true,
         *   About_Section: 'Exercitationem ... labore.',
         *   Affiliations: 'American College of Endocrinology\n' +
         *     'The Endocrine Society\n' +
         *     'American Diabetes Association',
         *   Board_Certifications: 'American Board of Pediatrics',
         *   Education: 'David Geffen School of Medicine - MD\n' +
         *     'Yale - Residency, Ophthalmology\n' +
         *     'Yale - Fellowship, Cataracts and Refractive Surgery',
         *   Languages: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
         *   Office_Name: 'Davis Family Medical Group',
         *   Office_Address: '0519 Mustafa Via',
         *   Office_City: 'New Bradlyhaven',
         *   Office_State: 'MI',
         *   Office_Zip: '50198',
         *   Office_Phone: '967-841-6054',
         *   ViewCount: 3654
         * }
         *
         * async function copyTableRecord() {
         *   const newFieldValues = {
         *     First_Name: 'Pam',
         *     Last_Name: 'Halpert',
         *     Title: 'Artist',
         *     Email: 'pam.halpert@gmail.com',
         *     Profile_Photo: '',
         *     About_Section: 'I grew up in Scranton and I am super cool!'
         *   }
         *   const whereClause = `Email = 'Lelah.Hoppe@gmail.com'`;
         *   const copiedRecord = await caspio.utils.copyRecord('Demo_Physicians', whereClause, newFieldValues);
         *   console.log(copiedRecord);
         *   return copiedRecord;
         * }
         *
         * copyTableRecord();
         *
         * // sample return value
         * {
         *   Physician_ID: '0R50T9HF',
         *   Date_Created: '2020-10-07T04:54:19',
         *   First_Name: 'Pam',
         *   Last_Name: 'Halpert',
         *   Title: 'Artist',
         *   Full_Name: 'Pam Halpert',
         *   Gender: 'Other',
         *   Email: 'pam.halpert@gmail.com',
         *   Account_Status: true,
         *   Profile_Status: false,
         *   Profile_Photo: '',
         *   Specialties: {
         *     '3': 'Family Medicine',
         *     '6': 'Obstetrics and Gynecology',
         *     '8': 'Pain Management',
         *     '9': 'Pathology'
         *   },
         *   Accepting_New_Patients: true,
         *   About_Section: 'I grew up in Scranton and I am super cool!',
         *   Affiliations: 'American College of Endocrinology\n' +
         *     'The Endocrine Society\n' +
         *     'American Diabetes Association',
         *   Board_Certifications: 'American Board of Pediatrics',
         *   Education: 'David Geffen School of Medicine - MD\n' +
         *     'Yale - Residency, Ophthalmology\n' +
         *     'Yale - Fellowship, Cataracts and Refractive Surgery',
         *   Languages: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
         *   Office_Name: 'Davis Family Medical Group',
         *   Office_Address: '0519 Mustafa Via',
         *   Office_City: 'New Bradlyhaven',
         *   Office_State: 'MI',
         *   Office_Zip: '50198',
         *   Office_Phone: '967-841-6054',
         *   ViewCount: 3654
         * }
         */
        copyRecord: async (tableName, whereClauseToFindRecord, recPropUpdateObj = {}) => {
          try {
            // get table definition of copy source to see what all fields need to be handled
            const tableDefinition = await api.tables.definition(tableName);

            /* notes about valid fields for new record coming from copied record:
              - a formula field cannot be written to
              - a password field can neither be read nor written to
              - field types that are read-only ('AUTONUMBER', 'PREFIXED AUTONUMBER', 'GUID', 'RANDOM ID', 'TIMESTAMP') cannot be written to
              - all fields that can either not be read or written to should be omitted in the copy process
            */
            const validFieldsForNewRecord = tableDefinition.filter((field) => !(field.IsFormula || field.Type === 'PASSWORD' || _utils.casData.readOnlyFieldTypes.includes(field.Type)));

            /* notes about list fields:
              - Caspio's REST API is weird about handling things as they concern list types
              - essentially, if you are updating or posting a new record and a field has a list type,
                then what you enter for the value of that field needs to be an array comprised of
                only valid INDICES from the hashmap that defines the list field
              - example: suppose a list field has a definition as follows:
                "ListField": { "1": "2020-01-01", "2": "42", "3": "Date as a string", "4": "Number as a string", "5": "String", "6": "This is a string" }
                The valid indices here are 1, 2, 3, 4, 5, and 6. If you want to post or update a record with a value(s) for this field,
                then you will need to provide something like [val1, val2, ..., valn]  where each val corresponds to one of the valid indices in the field definition
                For example, [ 1, 2, 4, 6 ] would result in the following object being copied over: { "1": "2020-01-01", "2": "42", "4": "Number as a string", "6": "This is a string" }
              - beware of odd behavior you can get when you DELETE or REMOVE one of the list field values. For example, above, if we removed "42" from the list values,
                which corresponds to index 2, then index 2 is no longer a valid index to use when posting to or updating a field value that uses this list definition; also,
                beware that if we ADDED BACK "42" as a value to the list, then index 2 will become available again (as opposed to indices simply being removed permanently)
              - given the above, the only takeaway: THIS IS WEIRD
            */
            const listFieldTypes = ['LIST-STRING', 'LIST-NUMBER', 'LIST-DATE/TIME'];
            // collect the names of the fields that have type of LIST-DATE/TIME
            const dateFieldNames = [];
            // prepare list type data objects to be used to ensure proper copying/creation of new events
            const [reversedListFieldsDicts, validListFieldValues] = validFieldsForNewRecord.reduce((acc, field) => {
              if (listFieldTypes.includes(field.Type)) {
                if (field.Type === 'LIST-DATE/TIME') {
                  dateFieldNames.push(field.Name);
                  acc[0][field.Name] = Object.entries(field.ListField).reduce((acc, [key, val]) => {
                    const newDateFormat = new Date(val);
                    const newDateTime = newDateFormat.getTime();
                    acc[newDateTime] = key;
                    return acc;
                  }, {});
                  acc[1][field.Name] = Object.values(field.ListField).map((dateVal) => {
                    const newDateFormat = new Date(dateVal);
                    const newDateTime = newDateFormat.getTime();
                    return newDateTime;
                  });
                } else {
                  acc[0][field.Name] = Object.entries(field.ListField).reduce((acc, [key, val]) => {
                    acc[val] = key;
                    return acc;
                  }, {});
                  acc[1][field.Name] = Object.values(field.ListField);
                }
                return acc;
              }
              return acc;
            }, [{}, {}]);
            // ensure what you are trying to copy is legitimate and all fields to be copied can be written to
            const validFieldNames = validFieldsForNewRecord.map(({ Name }) => Name);
            // retreive the record to be used as the copy source
            let recordToCopy = await api.tables.getRecords(tableName, { where: whereClauseToFindRecord });
            if (!recordToCopy) return false; // getRecords returned nothing in which case an error was thrown
            if (!recordToCopy.length) {
              throw new Error('No such record to copy was found. Please try again.');
            } else if (recordToCopy.length > 1) {
              throw new Error(`The record could not be copied because ${recordToCopy.length} records were found that matched the provided WHERE clause to find the copy source. Please refine your WHERE clause so that it returns an unambiguous result to copy (i.e., a single record).`);
            } else {
              recordToCopy = recordToCopy[0];
            }
            // provide opportunity to overwrite any field values from the copy source that will no longer be accurate for the new event
            const propsToOverwrite = Object.keys(recPropUpdateObj);
            if (propsToOverwrite.some((propToOverwrite) => !validFieldNames.includes(propToOverwrite))) {
              throw new Error('One of the new field names included to overwrite does not exist. Please try again.');
            }
            recordToCopy = Object.assign(recordToCopy, recPropUpdateObj);
            // record to copy almost ready to go but one final purifying pass through is needed to ensure things go smoothly
            let filteredValues;
            const recordProps = Object.keys(recordToCopy);
            for (let i = 0; i < recordProps.length; i++) {
              const property = recordProps[i];
              // remove any invalid field name that either still exists or was added to the event to copy
              if (!validFieldNames.includes(property)) {
                delete recordToCopy[property];
                continue;
              }
              // if a field is of type LIST-{STRING|NUMBER|DATE/TIME}, then ensure the values to be used for the copy are valid
              // actual list values, not indices, will be used to test whether or not the given list item(s) is valid
              // if the item is not valid, then it simply will not be included in the event copy (thus not causing a program crash or thrown error)
              if (reversedListFieldsDicts[property] && recordToCopy[property]) {
                if (!Array.isArray(recordToCopy[property])) recordToCopy[property] = Object.values(recordToCopy[property]);
                if (dateFieldNames.includes(property)) {
                  const dateTimes = recordToCopy[property].map((dateVal) => {
                    const newDateFormat = new Date(dateVal);
                    const newDateTime = newDateFormat.getTime();
                    return newDateTime;
                  });
                  filteredValues = dateTimes.filter((dateTime) => validListFieldValues[property].includes(dateTime));
                } else {
                  filteredValues = recordToCopy[property].filter((value) => validListFieldValues[property].includes(value));
                }
                recordToCopy[property] = filteredValues.map((val) => reversedListFieldsDicts[property][val]).map(Number);
              }
            }
            const createReq = await api.tables.createRecord(tableName, recordToCopy, { row: true });
            if (!createReq) {
              throw new Error('Something went wrong. The record was not successfully created. Please try again.');
            }
            const { createdRecord } = createReq;
            return createdRecord;
          } catch (error) {
            console.error(error);
          }
        },
      },
    };

    return api;
  } catch (error) {
    console.error(error);
  }
}

module.exports = apiWrapper;
