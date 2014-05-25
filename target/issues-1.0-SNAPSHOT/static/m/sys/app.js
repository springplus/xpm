var sys = angular.module('sys', ['ui.router', 'ngResource', 'appUtils']);

sys.service('$$sysConfig', ['$state', function ($state) {
    return {
        role: {
            moduleName: 'sys',
            entityName: 'role',
            list: {
                title: '角色列表',
                header: {id: '序号', name: '角色名称', code: '角色编码'}
            },
            detailViews: [
                {title: '基础信息', fileName: 'mixList_detail'},
                {title: '用户分配', fileName: 'mixList_user'}
            ]
        }, permission: {
            moduleName: 'sys',
            entityName: 'permission',
            list: {
                title: '权限列表',
                header: {id: '序号', name: '权限名称', text: '权限描述符'}
            },
            detailViews: [
                {title: '基础信息', fileName: 'mixList_detail'}
            ]
        }
    }
}])

sys.templateProvider = function ($http, $$sysConfig, entityName, template) {
    var detailViews = eval("$$sysConfig." + entityName + ".detailViews");
    return tmpl_crud_view($http, {moduleName: 'sys', entityName: entityName, template: template, detailViews: detailViews })
}

sys.config(function ($stateProvider) {

    function setPromiseCrudState($stateProvider, moduleName, entityName) {
        var m = moduleName;
        var e = entityName;
        var m_e = m + '_' + e;
        var mDe = m + '.' + e;
        var detailViews = eval("$$" + m + "Config." + e + ".detailViews");
        $stateProvider.state(mDe, {
            url: "/" + e,
            views: {m: {templateProvider: function ($http) {
                return tmpl_crud_view($http, {moduleName: m, entityName: e, template: 'index'})
            }}},
            controller: m_e
        }).state(mDe + '.mixList', {
            url: "/mixList",
            views: { m_e: {
                templateProvider: function ($http, $$sysConfig) {
//                        var detailViews = eval("$$"+m+"Config."+e+".detailViews");
                    var tmpl = 'mixList'
                    if (detailViews.length > 1)tmpl = 'mixList_plus';
                    return tmpl_crud_view($http, {moduleName: m, entityName: e, template: tmpl, detailViews: detailViews})
                }
            }
            },
            controller: m_e + '_mixList'
        })

        if (detailViews.length == 1) {

        } else if (detailViews.length > 1) {
            for (var view in detailViews) {
                var viewName = view.replace("_", ".")
                var subViewName = viewName.split(".")[1];
                var views = eval("{" + m_e + "_" + viewName + "{ templateUrl: \"m/" + m + "/" + e + "/" + viewName + ".html\" }}");
                $stateProvider.state(mDe + '.' + viewName, {
                    url: "/" + subViewName + "/:item",
                    views: views,
                    controller: m_e + "_" + viewName
                })
            }
        }

    }

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
//        .state('sys.role', {
//            url: "/role",
//            views: {
//                sys: {
//                    templateProvider: function ($http) {
//                        return tmpl_crud_view($http, {moduleName: 'sys', entityName: 'role', template: 'index'})
//                    }
//                }
//            },
//            controller: 'sys_role'
//        }).state('sys.role.mixList', {
//            url: "/mixList",
//            views: {
//                sys_role: {
//                    templateProvider: function ($http, $$sysConfig) {
//                        return tmpl_crud_view($http, {moduleName: 'sys', entityName: 'role', template: 'mixList_plus', detailViews: $$sysConfig.role.detailViews })
//                    }
//                }
//            },
//            controller: 'sys_role_mixList'
//        }).state('sys.role.mixList.detail', {
//            url: "/detail/:item",
//            views: {
//                sys_role_mixList_detail: { templateUrl: "m/sys/role/mixList_detail.html" }
//            },
//            controller: 'sys_role_mixList_detail'
//        }).state('sys.role.mixList.user', {
//            url: "/user/:item",
//            views: {
//                sys_role_mixList_user: { templateUrl: "m/sys/role/mixList_user.html" }
//            },
//            controller: 'sys_role_mixList_user'
//        })
        //--------------app--------------------->
        .state('sys.app', {
            url: "/app",
            views: {
                sys: {templateProvider: function ($http) {
                    return tmpl_crud_view($http, {moduleName: 'sys', entityName: 'app', template: 'index'})
                }
                }
            },
            controller: 'sys_app'
        }).state('sys.app.mixList', {
            url: "/mixList",
            views: {
                sys_app: {templateProvider: function ($http) {
                    return tmpl_crud_view($http, {moduleName: 'sys', entityName: 'app', template: 'mixList'})
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
                sys: {templateProvider: function ($http) {
                    return tmpl_crud_view($http, {moduleName: 'sys', entityName: 'permission', template: 'index'})
                }
                }
            },
            controller: 'sys_permission'
        }).state('sys.permission.mixList', {
            url: "/mixList",
            views: {
                sys_permission: {templateProvider: function ($http) {
                    return tmpl_crud_view($http, {moduleName: 'sys', entityName: 'permission', template: 'mixList'})
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
        });

    setPromiseCrudState($stateProvider, 'sys', 'role');

})

