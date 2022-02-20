const caspioData = require('./caspio');

module.exports = {
  /**
   * Builds, encodes (URI-encoded), and cleans (makes sure only single quotes are present) a `WHERE` clause to be used for a query
   * @param {string} whereClause `WHERE` clause`
   * @returns {string} URI-encoded `WHERE` clause`
   */
  whereClauseBuilder: (whereClause) => {
    try {
      if (typeof whereClause !== 'string') {
        throw new Error(`The following WHERE clause provided is invalid: ${whereClause}. The WHERE clause must be a string.`);
      }
      const cleanedWhereClause = whereClause.replace(/"/g, "'");
      const encodedWhereClause = encodeURIComponent(cleanedWhereClause);
      return encodedWhereClause;
    } catch (error) {
      console.error(error);
    }
  },
  /**
   * Returns a set of table or view record objects *without* the `PK_ID` field property attached. See [the Caspio docs](https://howto.caspio.com/web-services-api/rest-api/special-considerations/) for details on what this `PK_ID` field property is.
   * @param {Array.<Object>} dataRecords Records from a table or view
   * @returns {string} Returns all data records after having delete the PK_ID field
   */
  stripPKIDFields: (dataRecords) => {
    try {
      const cleanedDataRecords = dataRecords.map((record) => {
        delete record.PK_ID;
        return record;
      });
      return cleanedDataRecords;
    } catch (error) {
      console.error(error);
    }
  },
  /**
   * Validates and builds the query string given a selection criteria for retrieving records in a *non-paginated* fashion from a table or view
   * @param {Object} selectionCriteriaObj Query criteria object
   * @returns {string} Query string to be used
   */
  criteriaQueryBuilder: (selectionCriteriaObj) => {
    try {
      const queryObj = { ...selectionCriteriaObj };
      const defaultCriteriaObj = { ...caspioData.defaultSelectionCriteria };

      const validQueryParameters = caspioData.validTblViewQueryParameters;
      const invalidQueryParameters = Object.keys(queryObj).filter((queryName) => !validQueryParameters.includes(queryName));

      if (invalidQueryParameters.length !== 0) {
        throw new Error(`A query parameter you entered is invalid: ${invalidQueryParameters}. Please enter a valid query parameter: ${validQueryParameters}`);
      }

      const finalizedQueryObj = Object.assign(defaultCriteriaObj, queryObj);
      const finalizedQueryString = Object.entries(finalizedQueryObj).reduce((acc, [queryName, queryValue]) => {
        // ensure the type(s) and value(s) are in accordance with what Caspio accepts
        if (typeof queryValue === 'string') {
          queryValue = queryValue.replace(/"/g, "'");
        } else if (typeof queryValue !== 'number') {
          throw new Error(`All query parameter values must be either a string or a number. The following value for '${queryName}' violates this condition: ${queryValue}.`);
        }

        // ensure the query string is created and formatted as required by Caspio
        const partialQueryString = `q.${queryName}=${encodeURIComponent(queryValue)}`;
        if (queryName === 'select') {
          acc += `?${partialQueryString}`;
        } else {
          acc += `&${partialQueryString}`;
        }
        return acc;
      }, '');
      return finalizedQueryString;
    } catch (error) {
      console.error(error);
    }
  },
  /**
   * Validates and builds the query string given a selection criteria for retrieving records in a *paginated* fashion from a table or view
   * @param {Object} selectionCriteriaObj Query criteria object
   * @returns {string} Query string to be used
   */
  criteriaQueryBuilderPaginated: (selectionCriteriaObj) => {
    try {
      const queryObj = { ...selectionCriteriaObj };
      const defaultCriteriaObj = { ...caspioData.defaultSelectionCriteriaPaginated };
      const validQueryParameters = caspioData.validTblViewQueryParameters;
      const invalidQueryParameters = Object.keys(queryObj).filter((queryName) => !validQueryParameters.includes(queryName));

      if (invalidQueryParameters.length !== 0) {
        throw new Error(`A query parameter you entered is invalid: ${invalidQueryParameters}. Please enter a valid query parameter: ${validQueryParameters}`);
      }

      const q = Object.assign(defaultCriteriaObj, queryObj);

      // if "limit" is not provided, then 100 is assumed
      if (!q.limit) {
        q.limit = 100;
      }

      // if only one of "pageNumber" or "pageSize" is used,
      // then the default value will be applied for the second one
      // (default for "pageNumber" is 1, default for "pageSize" is 25)
      if (!(q.pageNumber && q.pageSize) && (q.pageNumber || q.pageSize)) {
        if (q.pageNumber && !q.pageSize) {
          q.pageSize = 25;
        }
        if (q.pageSize && !q.pageNumber) {
          q.pageNumber = 1;
        }
        // if at least one of "pageNumber" or "pageSize" is provided,
        // then "limit" will be skipped
        delete q.limit;
      }

      // remove default "pageNumber" and "pageSize" properties if neither was provided
      if (!(q.pageNumber || q.pageSize)) {
        delete q.pageNumber;
        delete q.pageSize;
      }

      const finalizedQueryObj = q;
      const finalizedQueryString = Object.entries(finalizedQueryObj).reduce((acc, [queryName, queryValue]) => {
        // ensure the type(s) and value(s) are in accordance with what Caspio accepts
        if (typeof queryValue === 'string') {
          // single quotes are used to indicate the beginning and end of a string in SQL
          queryValue = queryValue.replace(/"/g, "'");
        } else if (typeof queryValue === 'number') {
          switch (queryName) {
            case 'limit':
              if (queryValue < 1 || queryValue > 1000) {
                throw new Error(`${queryValue} is not a valid value for the ${queryName} query parameter. The ${queryName} query parameter accepts values between 1 and 1000, inclusive.`);
              }
              break;
            case 'pageNumber':
              if (queryValue < 1) {
                throw new Error(`${queryValue} is not a valid value for the ${queryName} query parameter. The ${queryName} query parameter accepts values greater than or equal to 1.`);
              }
              break;
            case 'pageSize':
              if (queryValue < 5 || queryValue > 1000) {
                throw new Error(`${queryValue} is not a valid value for the ${queryName} query parameter. The ${queryName} query parameter accepts values between 5 and 1000, inclusive.`);
              }
              break;
            default:
              break;
          }
        } else {
          throw new Error(`All query parameter values must be either a string or a number. The value ${queryValue} violates this condition.`);
        }

        // ensure the query string is created and formatted as required by Caspio
        const partialQueryString = `q.${queryName}=${encodeURIComponent(queryValue)}`;
        if (queryName === 'select') {
          acc += `?${partialQueryString}`;
        } else {
          acc += `&${partialQueryString}`;
        }
        return acc;
      }, '');
      return finalizedQueryString;
    } catch (error) {
      console.error(error);
    }
  },
};
