pimsServices.service('GroupService', ['AttributeModel',
    function (AttributeModel){
        this.getMembers = function (group, users) {
            var groupMembers = group.users;
            return users.filter(function (user) {
                if(groupMembers.includes(user.id))
                    return user;
            })
        };
        this.daoGroup = function (group, groupMembers) {
            group.users= groupMembers.map(function (gm) {
                return gm.id
            })
            return group;
        }
    }]);