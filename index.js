const Router = require('./router')

const tldr = require("./lib/tldr");

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handler(request) {
    const init = {
        headers: { 'content-type': 'text/plain' },
    }

    // const resp = await tldr.getTldr("tar");
    const url = new URL(request.url);
    const path = url.pathname;
    const resp = path;
    return new Response(resp, init)
}

async function handleRequest(request) {
    const r = new Router()
    // Replace with the approriate paths and handlers
    r.get('.*', request => handler(request));
    // r.get('.*/foo', request => handler(request))
    // r.post('.*/foo.*', request => handler(request))
    // r.get('/demos/router/foo', request => fetch(request)) // return the response from the origin

    r.get('/', () => new Response('Hello worker 2!')) // return a default message for the root route

    const resp = await r.route(request)
    return resp
}
