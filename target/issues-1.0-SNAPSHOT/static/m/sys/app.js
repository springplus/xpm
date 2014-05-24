var sys = angular.module('sys', ['ui.router', 'ngResource', 'appUtils']);

sys.config(function ($stateProvider) {
    $stateProvider
        .state('sys', {
            url: "/sys",
            views: {
                index: { templateUrl: "m/sys/views/index.html" }
            },
            controller: 'sys'
        }).state('sys.user', {
            url: "/user",
            views: {
                sys: { templateUrl: "m/sys/user/index.html" }
            },
            controller: 'sys_user'
        }).state('sys.user.mixList', {
            url: "/mixList",
            views: {
                sys_user: { templateUrl: "m/sys/user/mixList.html" }
            },
            controller: 'sys_user_mixList'
        }).state('sys.user.list', {
            url: "/list",
            views: {
                sys_user: { templateUrl: "m/sys/user/list.html" }
            },
            controller: 'sys_user_List'
        }).state('sys.user.mixList.detail', {
            url: "/detail/:item",
            views: {
                sys_user_mixList: { templateUrl: "m/sys/user/mixList_detail.html" }
            },
            controller: 'sys_user_mixList_detail'
        }).state('sys.user.profile', {
            url: "/profile",
            views: {
                sys_user: { templateUrl: "m/sys/user/profile.html" }
            },
            controller: 'sys_user_profile'

        })
        //--------------role--------------------->
        .state('sys.role', {
            url: "/role",
            views: {
                sys: {
                    templateProvider: function ($http, $timeout) {
                        return simple_crud_tmpl($http, $timeout, {entityName: 'role', template: 'index'})
                    }
                }
            },
            controller: 'sys_role'
        }).state('sys.role.mixList', {
            url: "/mixList",
            views: {
                sys_role: {
                    templateProvider: function ($http, $timeout) {
                        return simple_crud_tmpl($http, $timeout, {entityName: 'role', template: 'mixList'})
                    }
                }
            },
            controller: 'sys_role_mixList'
        }).state('sys.role.mixList.detail', {
            url: "/detail/:item",
            views: {
                sys_role_mixList: { templateUrl: "m/sys/role/mixList_detail.html" }
            },
            controller: 'sys_role_mixList_detail'
        })
        //--------------app--------------------->
        .state('sys.app', {
            url: "/app",
            views: {
                sys: {templateProvider: function ($http, $timeout) {
                    return simple_crud_tmpl($http, $timeout, {entityName: 'app', template: 'index'})
                }
                }
            },
            controller: 'sys_app'
        }).state('sys.app.mixList', {
            url: "/mixList",
            views: {
                sys_app: {templateProvider: function ($http, $timeout) {
                    return simple_crud_tmpl($http, $timeout, {entityName: 'app', template: 'mixList'})
                }
                }
            },
            controller: 'sys_app_mixList'
        }).state('sys.app.mixList.detail', {
            url: "/detail/:item",
            views: {
                sys_app_mixList: { templateUrl: "m/sys/app/mixList_detail.html" }
            },
            controller: 'sys_app_mixList_detail'
        })
        //--------------permission--------------------->
        .state('sys.permission', {
            url: "/permission",
            views: {
                sys: {templateProvider: function ($http, $timeout) {
                    return simple_crud_tmpl($http, $timeout, {entityName: 'permission', template: 'index'})
                }
                }
            },
            controller: 'sys_permission'
        }).state('sys.permission.mixList', {
            url: "/mixList",
            views: {
                sys_permission: {templateProvider: function ($http, $timeout) {
                    return simple_crud_tmpl($http, $timeout, {entityName: 'permission', template: 'mixList'})
                }
                }
            },
            controller: 'sys_permission_mixList'
        }).state('sys.permission.mixList.detail', {
            url: "/detail/:item",
            views: {
                sys_permission_mixList: { templateUrl: "m/sys/permission/mixList_detail.html" }
            },
            controller: 'sys_permission_mixList_detail'
        })
})

