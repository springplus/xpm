var sys = angular.module('sys', ['ui.router', 'ngResource', 'appUtils']);
//detailVies 设置了fileName说明采用了自定义的文件，在加载模板时，直接加载该文件返回。
var sys_config = {
    role: {
        moduleName: 'sys',
        entityName: 'role',
        list: {
            title: '角色列表',
            header: {id: '序号', name: '角色名称', code: '角色编码'},
            view: 'mixListPlus'
        },
        detailViews: [
            {title: '基础信息', parentView: 'mixListPlus', fileName: 'detail'},
            {title: '用户分配', parentView: 'mixListPlus', fileName: 'user'}
        ]
    }, permission: {
        moduleName: 'sys',
        entityName: 'permission',
        list: {
            title: '权限列表',
            header: {id: '序号', name: '权限名称', text: '权限描述符'},
            view: 'mixList'
        },
        detailViews: [
            {title: '基础信息', parentView: 'mixList', fileName: 'detail'}
        ]
    }, app: {
        moduleName: 'sys',
        entityName: 'app',
        list: {
            title: '应用列表',
            header: {id: '序号', name: '名称', code: '应用编码'},
            view: 'mixList'
        },
        detailViews: [
            {title: '基础信息', parentView: 'mixList', fileName: 'detail'},
        ]
    }
}

sys.service('$$sysConfig', ['$state', function ($state) {
    return sys_config
}])

//sys.templateProvider = function ($http, $$sysConfig, entityName, template) {
//    var detailViews = eval("$$sysConfig." + entityName + ".detailViews");
//    return tmpl_crud_list_view($http, {moduleName: 'sys', entityName: entityName, template: template, detailViews: detailViews })
//}

sys.config(function ($stateProvider) {

    function checkEntityConfig(entityConfig) {
        var ec = entityConfig;
        if (!ec) {
            logErrorMsg('entityConfig不能为空');
            return false
        }
        else if (!ec.moduleName || !ec.entityName || !ec.list || !ec.detailViews) {
            logErrorMsg('entityConfig的属性moduleName、entityName、list、detailViews不能为空。');
            return false;
        } else {
            var viewIsOk = true;
            for (var viewIndex in ec.detailViews) {
                var view = ec.detailViews[viewIndex];
                if (!view.title || !view.parentView || !view.fileName) {
                    logErrorMsg('detailViews[x]的属性title、parentView、fileName不能为空。',view);
                    viewIsOk = false;
                }
            }
            if(!viewIsOk)return false;
            if(!ec.list.view){
                logErrorMsg("list",ec.list)
            }
        }
        return true;
    }

    function logErrorMsg(checkedInfo,data) {
        console.error(">>>数据格式有误>>>"+checkedInfo+">>>",data)
    }

    function setPromiseCrudState($stateProvider, entityConfig) {
        //检查数据是否正常
        if (!checkEntityConfig(entityConfig)) {
            console.error(">>>数据格式不符合要求>>>未setPromiseCrudState,entityConfig:", entityConfig);
            return;
        }

        var indexState = entityConfig.moduleName + '.' + entityConfig.entityName;
        var listState = indexState + "." + entityConfig.list.view;

        $stateProvider.state(indexState, { url: genUrl(indexState), views: genView(indexState), controller: genController(indexState) })
        log(indexState);
        $stateProvider.state(listState, {url: genUrl(listState), views: genView(listState), controller: genController(listState)})
        log(listState);
        for (var detailView in entityConfig.detailViews) {
            var detailState = listState + "." + entityConfig.detailViews[detailView].fileName;
            $stateProvider.state(detailState, {url: genUrl(detailState), views: genView(detailState), controller: genController(detailState)})
            log(detailState);
        }

        function log(stateName) {
            console.debug(stateName + ">>url:", genUrl(stateName))
            console.debug(stateName + ">>controller:", genController(stateName))
            console.debug(stateName + ">>views:", genView(stateName))
        }

        function genView(stateName) {
            var views = {};
            var flags = stateName.split(".");
            var viewName = "";
            //eg：sys.role，flags有两项，则在父级中的视图sys中展示
            if (flags.length == 2) {
                viewName = flags[0]
            }
            //eg: sys.role.mixListPlus flags有三项，则在父级中的视图sys_role中展示
            else if (flags.length == 3) {
                viewName = flags[0] + "_" + flags[1]
            }
            //eg: sys.role.mixListPlus.detail有四项，则在父级中的视图sys_role_mixListPlus_detail中展示
            //这里的视图不是sys_role_mixListPlus，是由于这一级是最后一级，不再嵌套子页面，且有场景是展示同级页面，如详情Tab页面
            else if (flags.length == 4) {
                viewName = flags[0] + "_" + flags[1] + "_" + flags[2] + "_" + flags[3]
            }
            else console.warn(">>>未支持该状态的解析>>>", state);

            if (flags.length == 4) {
                views[viewName] = { templateUrl: "m/" + flags[0] + "/" + flags[1] + "/" + flags[2] + "_" + flags[3] + ".html" }
            } else {
                views[viewName] = {templateProvider: function ($http, $$sysConfig) {
                    if (flags.length == 2)
                        return tmpl_crud_index_view($http, $$sysConfig[flags[1]])
                    else if (flags.length == 3)
                        return tmpl_crud_list_view($http, $$sysConfig[flags[1]])
                    else
                        return "[stateName:" + stateName + "]配置有误！"
                }}
            }
            return views;
        }

        function genUrl(stateName) {
            //url会依据state名称进行继承，这里只需取最后的部分即可
            var flags = stateName.split(".");
            if (flags.length == 4)
                return "/" + flags[flags.length - 1] + "/:item"
            else return "/" + flags[flags.length - 1];
        }

        function genController(stateName) {
            //controller的名称与state的名称一致，将点号换成“_”。
            return stateName.replace(new RegExp("\\.", "g"), "_");
        }
    }

    $stateProvider.state('sys', {
        url: "/sys",
        views: {
            index: { templateUrl: "m/sys/index.html" }
        },
        controller: 'sys'
    })
    //--------------user--------------------->
    $stateProvider.state('sys.user', {
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
    setPromiseCrudState($stateProvider, sys_config.role);
//    $stateProvider.state('sys.role', {
//        url: "/role",
//        views: {
//            sys: {
//                templateProvider: function ($http, $$sysConfig) {
//                    return tmpl_crud_index_view($http, $$sysConfig.role)
//                }
//            }
//        },
//        controller: 'sys_role'
//    })
//        .state('sys.role.mixListPlus', {
//            url: "/mixListPlus",
//            views: {
//                sys_role: {
//                    templateProvider: function ($http, $$sysConfig) {
//                        return tmpl_crud_list_view($http, $$sysConfig.role)
//                    }
//                }
//            },
//            controller: 'sys_role_mixListPlus'
//        }).state('sys.role.mixListPlus.detail', {
//            url: "/detail/:item",
//            views: {
//                sys_role_mixListPlus_detail: { templateUrl: "m/sys/role/mixListPlus_detail.html" }
//            },
//            controller: 'sys_role_mixListPlus_detail'
//        }).state('sys.role.mixListPlus.user', {
//            url: "/user/:item",
//            views: {
//                sys_role_mixListPlus_user: { templateUrl: "m/sys/role/mixListPlus_user.html" }
//            },
//            controller: 'sys_role_mixListPlus_user'
//        })
    //--------------app--------------------->

    setPromiseCrudState($stateProvider, sys_config.app);

//    $stateProvider.state('sys.app', {
//        url: "/app",
//        views: {
//            sys: {templateProvider: function ($http, $$sysConfig) {
//                return tmpl_crud_list_view($http, {moduleName: 'sys', entityName: 'app', template: 'index'})
//            }
//            }
//        },
//        controller: 'sys_app'
//    }).state('sys.app.mixList', {
//        url: "/mixList",
//        views: {
//            sys_app: {templateProvider: function ($http, $$sysConfig) {
//                return tmpl_crud_list_view($http, {moduleName: 'sys', entityName: 'app', template: 'mixList'})
//            }
//            }
//        },
//        controller: 'sys_app_mixList'
//    }).state('sys.app.mixList.detail', {
//        url: "/detail/:item",
//        views: {
//            sys_app_mixList: { templateUrl: "m/sys/app/mixList_detail.html" }
//        },
//        controller: 'sys_app_mixList_detail'
//    })
    //--------------permission--------------------->

    setPromiseCrudState($stateProvider, sys_config.permission);

//    $stateProvider.state('sys.permission', {
//        url: "/permission",
//        views: {
//            sys: {templateProvider: function ($http, $$sysConfig) {
//                return tmpl_crud_list_view($http, {moduleName: 'sys', entityName: 'permission', template: 'index'})
//            }
//            }
//        },
//        controller: 'sys_permission'
//    }).state('sys.permission.mixList', {
//        url: "/mixList",
//        views: {
//            sys_permission: {templateProvider: function ($http, $$sysConfig) {
//                return tmpl_crud_list_view($http, {moduleName: 'sys', entityName: 'permission', template: 'mixList'})
//            }
//            }
//        },
//        controller: 'sys_permission_mixList'
//    }).state('sys.permission.mixList.detail', {
//        url: "/detail/:item",
//        views: {
//            sys_permission_mixList: { templateUrl: "m/sys/permission/mixList_detail.html" }
//        },
//        controller: 'sys_permission_mixList_detail'
//    });


})

