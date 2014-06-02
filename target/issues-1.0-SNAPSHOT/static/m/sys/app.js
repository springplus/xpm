var sys = angular.module('sys', ['ngGrid','ui.router', 'ngResource', 'appUtils']);

//detailVies 设置了templateData说明采用了模板文件。其它情况是自定义的文件，在加载模板时，直接加载该文件返回。
//active：[true|false]需在detailViews中的一个设置该项，一个或多个页面时时，需且只需设置一个页面。
sys.provider('$$sysConfig', function ($$sysForms) {
    this.user = {
        moduleName: 'sys',
        entityName: 'user',
        list: {
            view: 'mixListPlus',
            title: '用户列表',
            header: {id: '序号', name: '用户名称', login_name: '登录账号'},
            actions: {
                custom: [
//                    {name: '自定义', target: 'inner',group:"tabs", view: 'detail'}
                ],
                default: {
                    add: {name: '添加x', target: 'inner', group: "tabs", view: 'detail', enable: true},
                    delete: {name: '删除x', target: 'inner', group: "none", view: 'detail', enable: true}
                }
            }
        },
        detailViews: {tabs: [
            {title: '概况', parentView: 'mixListPlus', fileName: 'detail', active: true},
            {title: '角色授权', parentView: 'mixListPlus', fileName: 'role'},
            {title: '应用授权情况', parentView: 'mixListPlus', fileName: 'app'}
        ]}
    }
    this.role = {
        moduleName: 'sys',
        entityName: 'role',
        list: {
            view: 'mixListPlus',
            title: '角色列表',
            header: {id: '序号', name: '角色名称', code: '角色编码'}
        },
        detailViews: {tabs: [
            {title: '概况', parentView: 'mixListPlus', fileName: 'detail', active: true, templateData: $$sysForms.roleForm},
            {title: '角色权限', parentView: 'mixListPlus', fileName: 'permission'},
            {title: '用户分配', parentView: 'mixListPlus', fileName: 'user'}
        ]}
    }
    this.permission = {
        moduleName: 'sys',
        entityName: 'permission',
        list: {
            view: 'mixList',
            title: '权限列表',
            header: {id: '序号', name: '权限名称', text: '权限描述符'},
            actions: {
                default: {
                    add: {group: "tabs"}
                }
            }
        },
        detailViews: {tabs: [
            {title: '基础信息', parentView: 'mixList', fileName: 'detail', active: true, templateData: $$sysForms.permissionForm}
        ]}
    }
    this.app = {
        moduleName: 'sys',
        entityName: 'app',
        list: {
            view: 'mixListPlus',
            title: '应用列表',
            header: {id: '序号', name: '名称', code: '应用编码'}
        },
        detailViews: {tabs: [
            {title: '应用信息', parentView: 'mixListPlus', fileName: 'detail', active: true, templateData: $$sysForms.appForm},
            {title: '子模块信息', parentView: 'mixListPlus', fileName: 'subModule'}
        ]}
    }
    this.$get = function () {
        return this
    };
})


sys.config(function ($$appStateProvider, $$sysConfigProvider) {
    try {
        $$appStateProvider.setModuleState("sys");
        $$appStateProvider.setEntityCrudState($$sysConfigProvider.user);
//    $$appStateProvider.state('sys.user.profile', {
//        url: "/profile",
//        views: {
//            sys_user: { templateUrl: "m/sys/user/profile.html" }
//        },
//        controller: 'sys_user_profile'
//
//    })
        $$appStateProvider.setEntityCrudState($$sysConfigProvider.role);
        $$appStateProvider.setEntityCrudState($$sysConfigProvider.app);
        $$appStateProvider.setEntityCrudState($$sysConfigProvider.permission);
    } catch (e) {
        console.error(e.message, e.stack)
    }
})

