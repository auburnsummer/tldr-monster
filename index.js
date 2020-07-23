const Router = require('./router')

const tldr = require("./lib/tldr");
const _ = require("lodash");

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event))
})

async function handler(request, event) {
    const init = {
        headers: { 'content-type': 'text/plain' },
    }

    const url = new URL(request.url);
    const path = _.toLower(_.trimStart(url.pathname, "/"));

    // all available files
    const files = await tldr.getFiles();

    const ourFile = _.find(files, (file) => file.name === path);
    if (_.isUndefined(ourFile)) {
        return new Response("Not found!", init);
    }

    const resp = await tldr.getTldr(ourFile.platform, ourFile.name);

    return new Response(resp, init);
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
