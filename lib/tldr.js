const constants = require("./constants");

/**
 * Get a TLDR page.
 * @param {*} page 
 */
const getTldr = async (page) => {
    const url = `${constants.TLDR_URL}/pages/common/${page}.md`
    const response = await fetch(url, {
        cf: {
            cacheTtl: 86400,
            cacheEverything: true
        }
    });
    const result = await response.text();

    return result;
}

module.exports = {
    getTldr
}