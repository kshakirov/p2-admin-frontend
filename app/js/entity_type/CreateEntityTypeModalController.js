function createEntityTypeModalController(attr) {
    var attribute = attr;
    var CreateEntityTypeModalController = function ($uibModalInstance, $scope,
                                             EntityTypeModel, NgTableParams) {
       var entityTypes = null;
       $scope.init = function () {
            EntityTypeModel.findAll().then(function (entity_types) {
                entityTypes = entity_types;
                $scope.entityTypeTableParams = new NgTableParams({}, {dataset: entity_types});
            });
        };

        $scope.selectEntityType = function (id) {
            return EntityTypeModel.findOne(id).then(function (entity_type) {
                var result = {
                    entityType: entity_type,
                    entityTypes: entityTypes
                };
                $uibModalInstance.close(result);
            })
        };

        $scope.ok = function () {
            $uibModalInstance.close("Ok");
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("Cancel");
        };
    };
    CreateEntityTypeModalController.$inject = ['$uibModalInstance', '$scope',
        'EntityTypeModel', 'NgTableParams'];
    return CreateEntityTypeModalController;
}