pimsServices.service('UserService', ['AttributeModel',
    function (AttributeModel){
        this.getRoles = function (user, roles) {
            var roles = group.users;
            roles.filter(function (user) {
                if(groupMembers.includes(user.id))
                    return user;
            })
        };
        this.daoUser = function (user, userRoles) {
            user.roles = userRoles.map(function (ur) {
                return ur.id
            })
            return user;
        }
    }]);