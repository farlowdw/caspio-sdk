const axios = require('axios');
const axiosErrorHandler = require('./axios-error-handler');

function taskUtils(credentials) {
  const { baseURL, headers: caspioHeaders } = require('./api-config')(credentials);

  /**
   * Returns an array of objects where each object represents a task and its properties, where an additional key-value pair has been added to the task object to make it possible to identify a task's ID by using the name of the task instead of using the task ID to identify the task's name
   * @returns {Promise.<Array.<Object>>} An array of objects where each object represents a task and its properties but where an additional key-value pair has been added, where the key is the name of the task and the key's value is the Task ID or `ExternalKey` for that task; this makes it possible to identify a task's ID by means of its name instead of having to know the task's ID directly
   */
  async function taskKeysGivenTaskNames() {
    try {
      const theReq = await axios({
        method: 'get',
        url: `${baseURL}/v2/tasks`,
        headers: caspioHeaders,
      });
      const taskData = theReq.data.Result;
      taskData.forEach((task) => {
        const taskName = task.Name;
        const taskKey = task.ExternalKey;
        task[taskName] = taskKey;
      });
      return taskData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        axiosErrorHandler(error);
      } else {
        console.error(error);
      }
    }
  }

  const utils = {
    taskKeysGivenTaskNames,
  };

  return utils;
}

module.exports = taskUtils;
