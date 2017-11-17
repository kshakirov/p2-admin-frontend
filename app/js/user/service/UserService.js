pimsServices.service('UserService', ['AttributeModel',
    function (AttributeModel){
        this.getUserRoles = function (user, roles) {
            var user_roles = user.roles;
            return roles.filter(function (role) {
                if(user_roles.includes(role.id))
                    return role;
            })
        };
        this.daoUser = function (user, userRoles) {
            user.roles = userRoles.map(function (ur) {
                return ur.id
            })
            return user;
        };
        this.getUserGroupes = function (user, groups) {
            var user_groups = user.groups;
            return groups.filter(function (group) {
                if(user_groups.includes(group.id))
                    return group;
            })
        };
    }]);