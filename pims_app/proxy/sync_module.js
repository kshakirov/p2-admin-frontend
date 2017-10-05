function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-added', 'foobar');
  //  console.log('SyncModuleReq: ', Date.now());
}

function onProxyRes(proxyRes, req, res) {
    proxyRes.headers['x-added'] = 'foobar';     // add new header to response
    delete proxyRes.headers['x-removed'];       // remove header from response
}

function onError(err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
}

exports.onProxyReq = onProxyReq;
exports.onProxyRes = onProxyRes;