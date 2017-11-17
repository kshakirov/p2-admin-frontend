let Cookies = require("cookies"),
    cookie_name = 'token',
    tokenTools = require('../pims_app/proxy/tokenTools');
exports.index = function (req, res) {
    let cookies = new Cookies(req, res),
        admin = false,
        token = cookies.get(cookie_name);
    if (token) {
        token = token.replace(/%22/gi, "");
        let verified = tokenTools.verifyToken(token);
        if (verified) {
            admin = verified.admin;
        } else {
            console.log("Token Failed");
            cookies.set(cookie_name, {expires: Date.now()});
        }
    }
    res.render('index', { admin: admin});
};

exports.partial = function (req, res) {
    var type = req.params.type;
    var name = req.params.name;
    res.render('views/partials/' + type + "/" + name);
};