var metadata = angular.module('metadata', ['ui.router', 'ngResource', 'appUtils']);

metadata.config(function ($stateProvider) {
    $stateProvider
        .state('metadata', {
            url: "/metadata",
            views: {
                "index": { templateUrl: "m/metadata/views/index.html" }
            },
            controller: 'metadata'
        }).state('metadata.main', {
            url: "/main",
            views: {
                "metadata": { templateUrl: "m/metadata/views/main.html" }
            },
            controller: 'metadata_main'
        }).state('metadata.main.mixList', {
            url: "/main_mixList",
            views: {
                "metadata_main": { templateUrl: "m/metadata/views/main_mixList.html" }
            },
            controller: 'metadata_main_mixList'
        }).state('metadata.main.list', {
            url: "/main_list",
            views: {
                "metadata_main": { templateUrl: "m/metadata/views/main_list.html" }
            },
            controller: 'metadata_main_mixList'
        }).state('metadata.main.mixList.detail', {
            url: "/detail/:item",
            views: {
                "metadata_main_mixList": { templateUrl: "m/metadata/views/main_mixList_detail.html" }
            },
            controller: 'metadata_main_mixList_detail'
        })
        //--------------dict--------------------->
        .state('metadata.dict', {
            url: "/dict",
            views: {
                "metadata": { templateUrl: "m/metadata/views/dict.html" }
            },
            controller: 'metadata_dict'
        }).state('metadata.dict.mixList', {
            url: "/dict_mixList",
            views: {
                "metadata_dict": { templateUrl: "m/metadata/views/dict_mixList.html" }
            },
            controller: 'metadata_dict_mixList'
        }).state('metadata.dict.mixList.detail', {
            url: "/detail/:item",
            views: {
                "metadata_dict_mixList": { templateUrl: "m/metadata/views/dict_mixList_detail.html" }
            },
            controller: 'metadata_dict_mixList_detail'
        })

})