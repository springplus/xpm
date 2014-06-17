var project = angular.module('project', ['ui.router', 'ngResource', 'xgeeUtils']);

project.config(function ($stateProvider) {
    $stateProvider
        .state('project', {
            url: "/project",
            views: {
                "index": { templateUrl: "m/project/views/index.html" }
            },
            controller: 'project'
        }).state('project.main', {
            url: "/main",
            views: {
                "project": { templateUrl: "m/project/views/main.html" }
            },
            controller: 'project_main'
        }).state('project.main.mixList', {
            url: "/main_mixList",
            views: {
                "project_main": { templateUrl: "m/project/views/main_mixList.html" }
            },
            controller: 'project_main_mixList'
        }).state('project.main.list', {
            url: "/main_list",
            views: {
                "project_main": { templateUrl: "m/project/views/main_list.html" }
            },
            controller: 'project_main_mixList'
        }).state('project.main.mixList.detail', {
            url: "/detail/:item",
            views: {
                "project_main_mixList": { templateUrl: "m/project/views/main_mixList_detail.html" }
            },
            controller: 'project_main_mixList_detail'
        })


})




project.factory('$$projectRes', ['$resource','$$Data',function ($Resource,$$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略
        //-----------m.project-----------//
        project: $Resource("/api/project/:id", {id: '@id'}, $$Data.action)
    }
}]);