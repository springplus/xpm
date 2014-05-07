/**
 * Created by hongxueqian on 14-3-3.
 */
var app = angular.module('app', ['ui.router', 'ngResource', 'appUtils', 'metadata', 'project', 'sys']);

/**
 * 拦截响应
 */
app.factory('appRespInterceptor', function ($q, $filter) {
    return function (promise) {
        return promise.then(function (response) {
            //正常情况
            if (response.config.url.indexOf("/api/") != -1) {
                console.debug(">>intercept url contains '/api/'>>resp>>", response)
                if (angular.isArray(response.data))
                    response.data = appUtils.format4Views(response.data, $filter);
                else if (angular.isObject(response.data))
                    response.data = appUtils.format4View(response.data, $filter);
                //公共操作提示
                if(response.config.method=="POST"&&response.data==""){
                    appUtils.tipSuccess("提交成功！");
                }
            }
                return response;
        }, function (response) {
            //异常情况
            if(response.status==404){
                appUtils.tipError("<b>[404] 访问不到。<\/b><\/p>可能网络不通，或服务端不存在该资源，请稍后再试！");
            }else if (response.config.url.indexOf("/api/") != -1) {
                console.error(">>intercept url contains '/api/'>>resp>>",response)
                //公共操作提示
                appUtils.tipError("提交失败！"+response.data);
            }
            return $q.reject(response);
        })
    }
})

/**
 * 拦截请求
 */
app.factory('appReqInterceptor', function ($q) {
    return {
        request: function (config) {
            if (config.url.indexOf("/api/") != -1) {
                console.debug(">>intercept url contains '/api/'>>req>>", config)
            }
            return config || $q.when(config);
        }
    };
})
app.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {
    $stateProvider.state('index', {
        url: "/",
        controller: 'appCtrl'
    })
    $httpProvider.interceptors.push('appReqInterceptor');
    $httpProvider.responseInterceptors.push('appRespInterceptor');
}])


//---------设置全局变量-------------------//
var $$kvs = app.service('$$kvs', [ '$rootScope', function ($rootScope) {
    var service = {}
    return service;
}]);

function appCtrl($scope, $http, $state, $$Data) {
    //加载应用菜单
    $scope.appList = $$Data.App.query()

//    $http.get("m/core/data/app.json?type=app").success(function (data, status) {
//        $scope.appList = data;
//    });

    //加载上方的菜单
    $scope.loadModulesMenu = function (appCode) {
        //@TODO 异常处理
        $http.get("m/core/data/app_m_" + appCode + ".json?type=m&appCode=" + appCode).success(function (data, status) {
            $scope.menuItems = data;
        });
        if (appCode == "metadata") {
            $state.go('metadata.dict.mixList')
        }
        if (appCode == "project") {
            $state.go('project.main.mixList')
        }
        if (appCode == "sys") {
            $state.go('sys.user.mixList')
        }
    }


    //全局变更
    $scope.ctx = '/argularAppKit/webapp';
    $$kvs = {};
    $$kvs.issueWelcomePage = "MixList" //"List"
}


//-------------UI 初始化---------------//
$(document)
    .ready(function () {

//    $('.filter.menu .item')
//      .tab()
//    ;

//    $('.ui.rating')
//      .rating({
//        clearable: true
//      })
//    ;

        $('.ui.sidebar').sidebar('attach events', '.launch.label');
        $('.ui.sidebar').sidebar('attach events', '.launch.item');
        $('.ui.sidebar').sidebar('show');

        $('.ui.dropdown')
            .dropdown()
        ;

    })
;


