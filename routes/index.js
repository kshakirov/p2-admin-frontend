
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.partial = function (req, res) {
    var type = req.params.type;
  var name = req.params.name;
  res.render('views/partials/'+type + "/" + name);
};