pimsServices.service('EntityListService', ['$http', function ($http) {

    var body = {
        "attributeId": 56,
        "direction": "desc",
        "id": 0,
        "size": 10,
        "forward": true,
        "value": {}
    };


    this.createBody =  function (pageSize)  {
        body.size = pageSize;
        return body

    };

    this.updateBody =   function (pagination) {
        var p_c = pagination.content,
            actual = (body.forward) ? p_c.length - 1 : 0;
        body.id = p_c[actual].uuid;
        body.value = p_c[actual].attributes[body.attributeId];
        return body;
    };

    this.getFirstPage = function () {
        body.id = 0;
        body.forward = true;
        return body
    };


    this.getLastPage = function () {
        body.id = 0;
        body.forward = false;
        return body
    };

    this.getNextPage = function (pagination) {
        this.updateBody(pagination);
        return body
    };

    this.getPrevPage = function (pagination) {
        body.forward = false;
        this.updateBody(pagination);
        return body
    };

    this.setSortAttribute = function (layout) {
        body.attributeId =layout[0].uuid
    }


}]);