var projectApp = angular.module('projectApp', ['ngGrid', 'ui.router', 'ngResource', 'xgeeUtils']);

//project.config(function ($stateProvider) {
//    $stateProvider
//        .state('project', {
//            url: "/project",
//            views: {
//                "index": { templateUrl: "m/project/views/index.html" }
//            },
//            controller: 'project'
//        }).state('project.main', {
//            url: "/main",
//            views: {
//                "project": { templateUrl: "m/project/views/main.html" }
//            },
//            controller: 'project_main'
//        }).state('project.main.mixList', {
//            url: "/main_mixList",
//            views: {
//                "project_main": { templateUrl: "m/project/views/main_mixList.html" }
//            },
//            controller: 'project_main_mixList'
//        }).state('project.main.list', {
//            url: "/main_list",
//            views: {
//                "project_main": { templateUrl: "m/project/views/main_list.html" }
//            },
//            controller: 'project_main_mixList'
//        }).state('project.main.mixList.detail', {
//            url: "/detail/:item",
//            views: {
//                "project_main_mixList": { templateUrl: "m/project/views/main_mixList_detail.html" }
//            },
//            controller: 'project_main_mixList_detail'
//        })
//
//
//})
//
//

projectApp.provider('$$projectConfig', function ($$projectForms) {

    this.info = {
        moduleName: 'project',
        resName: 'info',
        view: {
            name: 'main',
            title: '项目信息',
            containers: {
                tabs: [
                    {name: 'detail', title: '概况', active: true},
                    {name: 'team', title: '团队成员' }
                ]
            }
        }
    }

    this.$get = function () {
        return this
    };
})

projectApp.constant('$$projectForms', {
    logicEntityForm: [
        {
            displayName: "名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            displayName: "编码",
            identifier: 'code',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            displayName: "描述",
            identifier: 'description',
            type_textarea: true
        }
    ]
})


projectApp.config(function ($xgeeRouterProvider, $$projectConfigProvider) {
    $xgeeRouterProvider.setModuleState("project");
    $xgeeRouterProvider.setState("project.center");
    $xgeeRouterProvider.setState("project.center.main");
    $xgeeRouterProvider.setResState($$projectConfigProvider.info)
//    $xgeeRouterProvider.setState("project.info");
//    $xgeeRouterProvider.setState("project.info.index");
})


projectApp.factory('$$projectRes', ['$resource', '$$Data', function ($Resource, $$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略
        //-----------m.project-----------//
        project: $Resource("/api/prj/project/:id", {id: '@id'}, $$Data.action)
    }
}]);