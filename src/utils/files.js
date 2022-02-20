const path = require('path');
const axios = require('axios');
const axiosErrorHandler = require('./axios-error-handler');

function fileUtils(credentials) {
  const { baseURL, headers: caspioHeaders } = require('./api-config')(credentials);

  /**
   * Returns the requested resource if found or false otherwise
   * @param {{Folders: Array.<Object>, Files: Array.<Object>}} filesFoldersObj An object with two properties, Folders and Files, both of which contain an array of objects describing folders and files, respectively
   * @param {string} resourceName Name of resource to find
   * @param {('f'|'d')} resourceType Resource type, where 'f' stands for *file* and 'd' stands for *directory*
   * @returns {Object} Found resource or false otherwise
   */
  function findResource(filesFoldersObj, resourceName, resourceType) {
    try {
      const { Files, Folders } = filesFoldersObj;
      if (resourceType === 'f') {
        const resource = Files.find((file) => file.Name === `${resourceName}`);
        if (resource) {
          return resource;
        }
        throw new Error(`The file '${resourceName}' does not exist in the specified location. Please try again.`);
      } else if (resourceType === 'd') {
        const resource = Folders.find((folder) => folder.Name === `${resourceName}`);
        if (resource) {
          return resource;
        }
        throw new Error(`The folder '${resourceName}' does not exist in the specified location. Please try again.`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Returns metadata linked to file or folder based on the ID provided
   * @param {string} externalKey File or Folder ID
   * @returns {{Folders: Array.<Object>, Files: Array.<Object>}} An object with two properties, Folders and Files, both of which contain an array of objects describing folders and files (as objects), respectively
   */
  async function metadataByKey(externalKey) {
    try {
      const theReq = await axios({
        method: 'get',
        url: `${baseURL}/v2/files?externalKey=${externalKey}`,
        headers: caspioHeaders,
      });
      return theReq.data.Result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        axiosErrorHandler(error);
      } else {
        console.error(error);
      }
    }
  }

  /**
   * Returns metadata about a specific file or folder
   * @param {string} resourcePath Path to resource
   * @param {{resourceType: ('f'|'d')}} options Options object; currently the only supported property is resourceType with possible values of `'f'` or `'d'` to denote *file* or *directory*, respectively
   * @returns {Object} Object with metainformation on the requested file or folder resource
   */
  async function fileOrDirectoryMetadata(resourcePath, options = { resourceType: 'f' }) {
    try {
      if (typeof resourcePath !== 'string') {
        throw new Error(`The following path provided is not valid: ${resourcePath}. A valid path must be a string.`);
      }

      if (!resourcePath.startsWith('/')) {
        throw new Error(`The provided path '${resourcePath}' is not valid. A valid path must begin with the '/' character.`);
      }

      if (resourcePath.endsWith('/')) {
        throw new Error(`The provided path '${resourcePath}' is not valid. A valid path must not end with the '/' character.`);
      }

      if (typeof options !== 'object') {
        throw new Error('The second argument provided is not valid. Ensure the second argument provided is an object with a \'resourceType\' property with a value of either \'f\' for \'file\' or \'d\' for \'directory\'.');
      }
      if (!Object.prototype.hasOwnProperty.call(options, 'resourceType')) {
        throw new Error('The second argument provided is not valid. The object provided must have a \'resourceType\' property set to either \'f\' for \'file\', which is the default, or \'d\' for \'directory\'.');
      }

      if (!(options.resourceType === 'f' || options.resourceType === 'd')) {
        throw new Error('The second argument provided is not valid. The object provided must have a \'resourceType\' property value of either \'f\' for \'file\', which is the default, or \'d\' for \'directory\'. Other values are not valid at this time.');
      }

      let foundResource;
      const targetResource = path.basename(resourcePath);
      let baseData = await metadataByKey('');

      if (resourcePath.lastIndexOf('/') === 0) {
        if (options.resourceType === 'f') {
          foundResource = findResource(baseData, targetResource, 'f');
        } else if (options.resourceType === 'd') {
          foundResource = findResource(baseData, targetResource, 'd');
        }
        return foundResource;
      }

      const directoriesToFind = path.dirname(resourcePath).split('/');

      for (let i = 1; i < directoriesToFind.length; i++) {
        const dirToFind = directoriesToFind[i];
        const foundDir = findResource(baseData, dirToFind, 'd');
        if (foundDir) {
          const dirKey = foundDir.ExternalKey;
          baseData = await metadataByKey(dirKey);
        } else {
          throw new Error(`Folder '${dirToFind}' not found as specified in the provided path: '${resourcePath}'. Please check your file structure and try again.`);
        }
      }

      foundResource = findResource(baseData, targetResource, options.resourceType);
      return foundResource;
    } catch (error) {
      console.error(error);
    }
  }

  const utils = {
    metadataByKey,
    fileOrDirectoryMetadata,
  };

  return utils;
}

module.exports = fileUtils;
