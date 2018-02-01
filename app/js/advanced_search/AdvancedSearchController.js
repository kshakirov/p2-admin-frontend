pimsApp.controller('AdvancedSearchController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AdvancedSearchModel', 'AttributeSetModel',
    'AttributeModel', 'usSpinnerService', 'AdvancedSearchService', '$q', 'ngNotify',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              AdvancedSearchModel,
              AttributeSetModel,
              AttributeModel,
              usSpinnerService,
              AdvancedSearchService,
              $q,
              ngNotify) {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid,
            references = null,
            query = 'propertyName=role&propertyValues=search';
        $scope.search_params = {};
        $scope.pageSize = 10;
        $scope.pageSizes = [10, 25, 50, 100];
        $scope.search_query = {
            size: $scope.pageSize,
            from: 0,
            type: entity_type_uuid,
            query: null,
            references: null,
            fields: [],
            sort: '5',
            referenceNames: {}
        };


        function PaginationObject(response) {
            return {

                currentPage: response.number,
                totalPages: Math.ceil(response.totalPages),
                first: response.first,
                last: response.last,
                totalRecords: response.totalPages * $scope.pageSize
            }
        }

        function paginate_entites(search_query) {
            return AdvancedSearchModel.findAll(search_query)
        }


        function getReferenceNameSets(references) {
            var request_hash = {},
                q = 'propertyName=role&propertyValues=reference_name';
            references.map(function (ref) {
                request_hash[ref.entityTypeId] = AttributeSetModel.search(ref.entityTypeId, q);
            });
            return $q.all(request_hash);
        }

        function getSortField(layout) {
            var valueType = layout[0].valueType.toLowerCase();
            if(valueType !='integer' && valueType!='decimal'){
                return layout[0].uuid.toString() + ".raw"
            }else{
                return layout[0].uuid.toString()
            }
        }

        function has_attribute_set(attributes_set) {
            if(attributes_set && attributes_set.length > 0)
                return true;
            return false
        }

        $scope.init = function () {
            usSpinnerService.spin('spinner-2');
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                if(has_attribute_set(attribute_set)) {
                    $scope.layout = attribute_set[0].attributes;
                    $scope.search_query.references = AdvancedSearchService.getReferences(attribute_set[0].attributes);
                    $scope.search_query.fields = AdvancedSearchService.getFields(attribute_set[0].attributes);
                    $scope.search_query.sort = getSortField($scope.layout);
                    getReferenceNameSets($scope.search_query.references).then(function (referencesName) {
                        $scope.search_query.referenceNames = AdvancedSearchService.prepReferencesName(referencesName);
                        console.log($scope.search_query.referenceNames);
                        return paginate_entites($scope.search_query).then(function (response) {
                            $scope.entities = response.content;
                            $scope.pagination = new PaginationObject(response);
                            usSpinnerService.stop('spinner-2');

                        }, function (error) {
                            console.log(error);
                            usSpinnerService.stop('spinner-2');
                        })
                    })
                }else{
                    usSpinnerService.stop('spinner-2');
                    ngNotify.set("No Fields To Render. Please, Create Attribute Set with Role 'search'" +
                        "and Add Attributes as Columns", {
                        position: 'top',
                        type: 'error',
                        duration: 20000,
                        sticky: true
                    });
                }
            })

        };

        $scope.getPage = function (page) {
            usSpinnerService.spin('spinner-2');
            $scope.search_query.from = page;
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response);
                usSpinnerService.stop('spinner-2');
            }, function (error) {
                console.log(error);
            })
        };

        $scope.search = function () {
            usSpinnerService.spin('spinner-2');
            $scope.search_query.from = 0;
            $scope.search_query.query = AdvancedSearchService
                .prepSearchParams($scope.search_params, $scope.layout);
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response);
                usSpinnerService.stop('spinner-2');
            },function (error) {
                console.log(error);
                usSpinnerService.stop('spinner-2');
            })
        };

        $scope.redirectToEntity = function (id) {
            console.log(id);
            $location.url('/entities/' + id)
        };

        $scope.$watch('pageSize', function () {
            $scope.search_query.size = $scope.pageSize || 10;
            $scope.search_query.from = 0;
            $scope.init();
        });

        $scope.clear = function (search_params) {
            console.log(search_params);
            var keys = Object.keys(search_params);
            keys.map(function (key) {
                search_params[key] = "";
            })
            $scope.search();
        }
    }]);


