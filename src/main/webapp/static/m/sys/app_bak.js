var sys = angular.module('sys', ['ui.router', 'ngResource', 'appUtils']);

sys.config(function ($stateProvider) {
    $stateProvider
        .state('sys', {
            url: "/sys",
            views: {
                "index": { templateUrl: "m/sys/views/index.html" }
            },
            controller: 'sys'
        }).state('sys.user', {
            url: "/user",
            views: {
                "sys": { templateUrl: "m/sys/views/user.html" }
            },
            controller: 'sys_user'
        }).state('sys.user.mixList', {
            url: "/user_mixList",
            views: {
                "sys_user": { templateUrl: "m/sys/views/user_mixList.html" }
            },
            controller: 'sys_user_mixList'
        }).state('sys.user.list', {
            url: "/user_list",
            views: {
                "sys_user": { templateUrl: "m/sys/views/user_list.html" }
            },
            controller: 'sys_user_mixList'
        }).state('sys.user.mixList.detail', {
            url: "/detail/:item",
            views: {
                "sys_user_mixList": { templateUrl: "m/sys/views/user_mixList_detail.html" }
            },
            controller: 'sys_user_mixList_detail'
        }).state('sys.user.profile', {
            url:"/user_profile",
            views:{
                "sys_user": { templateUrl: "m/sys/views/user_profile.html" }
            },
            controller: 'sys_user_profile'

        })
    //--------------role--------------------->
//        .state('sys.role', {
//            url: "/role",
//            views: {
//                "sys": { templateUrl: "m/sys/views/role.html" }
//            },
//            controller: 'sys_role'
//        }).state('sys.role.mixList', {
//            url: "/role_mixList",
//            views: {
//                "sys_role": { templateUrl: "m/sys/views/role_mixList.html" }
//            },
//            controller: 'sys_role_mixList'
//        }).state('sys.role.mixList.detail', {
//            url: "/detail/:item",
//            views: {
//                "sys_role_mixList": { templateUrl: "m/sys/views/role_mixList_detail.html" }
//            },
//            controller: 'sys_role_mixList_detail'
//        })

})