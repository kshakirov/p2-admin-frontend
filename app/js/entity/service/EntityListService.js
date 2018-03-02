pimsServices.service('EntityListService', ['$http', function ($http) {

    var body = {
        "attributeId": 0,
        "direction": "desc",
        "id": 0,
        "size": 10,
        "forward": true,
        "value": {}
    };

     function set_attribute (layout) {
        body.attributeId = layout[0].uuid
    }


    this.createBody = function (pageSize, layout) {
        body = {
            "attributeId": 56,
            "direction": "desc",
            "id": 0,
            "currentPage": 0,
            "totalElements": 0,
            "size": pageSize,
            "forward": true,
            "value": {}
        };
        set_attribute(layout);
        return body

    };

    this.updateBody = function (pagination) {
        var p_c = pagination.content,
            actual = (body.forward) ? p_c.length - 1 : 0;
        body.id = p_c[actual].uuid;
        body.value = p_c[actual].attributes[body.attributeId];
        body.currentPage = pagination.currentPage;
        body.totalElements = pagination.totalRecords;
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




}]);