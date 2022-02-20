/**
 * Handles HTTP Exceptions, specifically those thrown by the Axios package
 *
 * @param {any} error Axios error
 * @returns {void}
 */
function axiosErrorHandler(error) {
  const {
    status,
    statusText,
    data: { Message: message },
  } = error.response;
  console.log(`Caspio server response was "${status} ${statusText}"`);
  if (message) {
    console.log(`Inner exception message: "${message}"`);
  }
}

module.exports = axiosErrorHandler;
