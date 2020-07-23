const constants = require("./constants");

const pathParse = require("path-parse");
const _ = require("lodash");

/**
 * Get a listing of available files and what platform they're under.
 */
const getFiles = async (event) => {
    const query = `
    query { 
        repository(name:"tldr", owner:"tldr-pages"){
          common: object(expression:"master:pages/common") {
            ... on Tree {
              entries {
                name
              }
            }
          }
          linux: object(expression:"master:pages/linux"){
            ... on Tree {
              entries {
                name
              }
            }
          }
          osx: object(expression:"master:pages/osx") {
            ... on Tree {
              entries {
                name
              }
            }
          }
          windows: object(expression:"master:pages/windows"){
            ... on Tree {
              entries {
                name
              }
            }
          }
        }
      }
    `
    // is it in the cache?
    const cache = caches.default;
    const cacheString = "https://fake.tldr.monster";

    console.log("hi6!");

    let response = await cache.match(cacheString);
    if (!response) {
      console.log("It's not in the cache");
      // not in cache, we need to grab from origin
      response = await fetch(
        new Request(constants.GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: new Headers({
            'Authorization': `Bearer ${GITHUB_TOKEN}`,  // cloudflare secret
            'Content-Type': 'application/json',
            'User-Agent': 'auburnsummer/tldr-monster'
          }),
          body: JSON.stringify({query})
        })
      );
      // must use Response constructor to inherit all fields
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', `max-age=60`);
      // store it
      console.log("Storing it synchronously...");
      await cache.put(cacheString, response.clone());
    }

    const json = await response.json();

    // now for some processing. we're getting to a form where it's a list of objects with keys:
    // - platform - name
    const repository = _.get(json, "data.repository");
    const platforms = _.keys(repository);
    
    const filesWithPlatform = _.map(platforms, (platform) => {
      const entries = repository[platform].entries;
      return _.map(entries, (entry) => {
        return {
          platform,
          name: pathParse(entry.name).name
        }
      })
    })

    return _.flatten(filesWithPlatform);
}

/**
 * Get a TLDR page.
 */
const getTldr = async (platform, page) => {
    const url = `${constants.TLDR_URL}/pages/${platform}/${page}.md`;

    const response = await fetch(url, {
      cf: {
        cacheTtl: constants.CACHE_TIME,
        cacheEverything: true
      }
    });

    return response.text();
}

module.exports = {
    getTldr,
    getFiles
}