function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-added', 'foobar');
    console.log('SyncModuleReq: ', Date.now());
}

exports.onProxyReq = onProxyReq;