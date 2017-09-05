function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-added', 'foobar');
    console.log('PimsReq: ', Date.now());
}

exports.onProxyReq = onProxyReq;