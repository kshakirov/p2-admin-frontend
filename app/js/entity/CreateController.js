function createController(attr) {
    var attribute = attr;
    var EntityReferenceModalController = function ($uibModalInstance, $scope,
                                                   EntityModel, AttributeSetModel, usSpinnerService) {
        var entity_type_uuid = 7,
            pageSize = 10,
            query = 'propertyName=role&propertyValues=base_search';

        $scope.search_params = {};

        function paginate_entites(page, size) {
            return EntityModel.findAll(entity_type_uuid, page, size).then(function (response) {
                return response;
            })
        }

        function PaginationObject(response) {
            return {
                totalPages: response.totalPages,
                first: response.first,
                last: response.last,
                currentPage: response.number

            }
        }

        function paginate_entites(page, size, query) {
            if (query) {
                return EntityModel.search(entity_type_uuid, query, page, size).then(function (response) {
                    return response;
                })
            } else {
                return EntityModel.findAll(entity_type_uuid, page, size).then(function (response) {
                    return response;
                })
            }
        }

        function prepare_params(search_params) {
            var keys = Object.keys(search_params);
            keys = keys.filter(function (k) {
                if (search_params[k] && search_params[k].length > 0)
                    return k;
            });
            keys = keys.map(function (k) {
                return "attributeId=" + k + "&attributeValue=" + search_params[k];
            });
            if (keys.length == 0)
                return false
            else
                return keys.join("&");
        }

        $scope.init = function () {
            console.log(attribute);
            entity_type_uuid = attribute.properties.referencedEntityTypeId;
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                $scope.layout = attribute_set[0].attributes;
                return paginate_entites(0, pageSize).then(function (response) {
                    $scope.entities = response.content;
                    $scope.pagination = new PaginationObject(response);
                }, function (error) {
                    console.log(error);
                })
            })
        };

        $scope.getPage = function (page) {
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                $scope.layout = attribute_set[0].attributes;
                return paginate_entites(page, pageSize).then(function (response) {
                    $scope.entities = response.content;
                    $scope.pagination = new PaginationObject(response);
                }, function (error) {
                    console.log(error);
                })
            })
        };


        $scope.search = function (page) {
            usSpinnerService.spin('spinner-1');
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                $scope.layout = attribute_set[0].attributes;
                var query = prepare_params($scope.search_params);
                return paginate_entites(0, pageSize, query).then(function (response) {
                    $scope.entities = response.content;
                    $scope.pagination = new PaginationObject(response);
                    usSpinnerService.stop('spinner-1');

                }, function (error) {
                    console.log(error);
                })
            })
        }

        $scope.selectReference = function (id) {
            return EntityModel.findOne(entity_type_uuid, id).then(function (entity) {
                var result = {
                    attribute_id: attribute.uuid,
                    entityData: entity
                }
                $uibModalInstance.close(result);
            })
        };

        $scope.ok = function () {
            $uibModalInstance.close("Test");
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    };
    EntityReferenceModalController.$inject = ['$uibModalInstance', '$scope',
        'EntityModel', 'AttributeSetModel', 'usSpinnerService'];
    return EntityReferenceModalController;
}