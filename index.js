const Router = require('./router')

const tldr = require("./lib/tldr");
const formatter = require("./lib/format");
const _ = require("lodash");
const didyoumean = require("./lib/didyoumean");

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event))
})

async function handler(request, event) {
    const init = {
        headers: { 'content-type': 'application/octet-stream' },
    }

    const url = new URL(request.url);
    const path = _.toLower(_.trimStart(url.pathname, "/"));

    // all available files
    const files = await tldr.getFiles(event);

    const ourFile = _.find(files, (file) => file.name === path);

    if (_.isUndefined(ourFile)) {
        // okay, give them similar words...
        const title = `**Couldn't find ${path}. Similar commands:**`;
        const searchResults = didyoumean.similarWords(files, path);
        
        const lines = [title, formatter.formatSimilar(searchResults)];
        const builderMarkdown = _.join(lines, "\n");
        const builderFormatted = formatter.render(builderMarkdown);
        return new Response(builderFormatted, init);
    }

    const markdown = await tldr.getTldr(ourFile.platform, ourFile.name);

    const formatted = formatter.render(markdown);

    return new Response(formatted, init);
}

async function handleRequest(event) {
    const r = new Router()
    const {request} = event;
    // Replace with the approriate paths and handlers
    r.get('.*', request => handler(request, event));
    // r.get('.*/foo', request => handler(request))
    // r.post('.*/foo.*', request => handler(request))
    // r.get('/demos/router/foo', request => fetch(request)) // return the response from the origin

    r.get('/', () => new Response('Hello worker 2!')) // return a default message for the root route

    const resp = await r.route(request)
    return resp
}
