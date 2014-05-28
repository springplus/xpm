var sys = angular.module('sys', ['ui.router', 'ngResource', 'appUtils']);
sys.provider('$$sysConfig', function $$sysConfigProvider() {
    this.user = {
        moduleName: 'sys',
        entityName: 'user',
        list: {
            title: '用户列表',
            header: {id: '序号', name: '用户名称', login_name: '登录账号'},
            view: 'mixListPlus'
        },
        detailViews: [
            {title: '概况', parentView: 'mixListPlus', fileName: 'detail'},
            {title: '角色授权', parentView: 'mixListPlus', fileName: 'role'},
            {title: '应用授权情况', parentView: 'mixListPlus', fileName: 'app'}
        ]
    }
    this.role = {
        moduleName: 'sys',
        entityName: 'role',
        list: {
            title: '角色列表',
            header: {id: '序号', name: '角色名称', code: '角色编码'},
            view: 'mixListPlus'
        },
        //detailVies 设置了tmplData说明采用了模板文件。其它情况是自定义的文件，在加载模板时，直接加载该文件返回。
        detailViews: [
//            {title: '概况', parentView: 'mixListPlus', fileName: 'detail'},
            {title: '概况', parentView: 'mixListPlus', fileName: 'detail', templateData: '$$sysForms.userForm'},
            {title: '角色权限', parentView: 'mixListPlus', fileName: 'permission'},
            {title: '用户分配', parentView: 'mixListPlus', fileName: 'user'}
        ]
    }
    this.permission = {
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
    }
    this.app = {
        moduleName: 'sys',
        entityName: 'app',
        list: {
            title: '应用列表',
            header: {id: '序号', name: '名称', code: '应用编码'},
            view: 'mixListPlus'
        },
        detailViews: [
            {title: '应用信息', parentView: 'mixListPlus', fileName: 'detail'},
            {title: '子模块信息', parentView: 'mixListPlus', fileName: 'subModule'}
        ]
    }
    this.$get = function(){return{}};
})

sys.constant('$$sysForms', {
    userForm: {
        name: {
            name: "名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        code: {
            name: "编码",
            identifier: 'code',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        }
    },
    user: {
        moduleName: 'sys',
        entityName: 'user',
        list: {
            title: '用户列表',
            header: {id: '序号', name: '用户名称', login_name: '登录账号'},
            view: 'mixListPlus'
        },
        detailViews: [
            {title: '概况', parentView: 'mixListPlus', fileName: 'detail'},
            {title: '角色授权', parentView: 'mixListPlus', fileName: 'role'},
            {title: '应用授权情况', parentView: 'mixListPlus', fileName: 'app'}
        ]
    }
})


sys.config(function ($$appStateProvider, $$sysConfigProvider) {
    $$appStateProvider.setModuleState("sys");
    $$appStateProvider.setEntityCrudState($$sysConfigProvider.user);

    $$appStateProvider.state('sys.user.profile', {
        url: "/profile",
        views: {
            sys_user: { templateUrl: "m/sys/user/profile.html" }
        },
        controller: 'sys_user_profile'

    })
    $$appStateProvider.setEntityCrudState($$sysConfigProvider.role);
    $$appStateProvider.setEntityCrudState($$sysConfigProvider.app);
    $$appStateProvider.setEntityCrudState($$sysConfigProvider.permission);
})

