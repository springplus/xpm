/**
 * Created by hongxueqian on 14-3-3.
 */
var app = angular.module('app', ['ngGrid', 'ui.router', 'ngResource', 'appUtils', 'metadata', 'project', 'sys']);

app.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {
    $stateProvider.state('index', {
        url: "/",
        controller: 'appCtrl'
    })
    $httpProvider.interceptors.push('appReqInterceptor');
    $httpProvider.responseInterceptors.push('appRespInterceptor');
}])


//---------全局服务-------------------//
/**
 * 拦截响应
 */
app.factory('appRespInterceptor', function ($q, $filter) {
    return function (promise) {
        return promise.then(function (response) {
            //正常情况或返回页面404
            if (response.config.url.indexOf("/api/") != -1) {
                console.debug(">>intercept url contains '/api/'>>" + response.config.url + ">>resp>>", response)
                if (angular.isArray(response.data))
                    response.data = appUtils.format4Views(response.data, $filter);
                else if (angular.isObject(response.data))
                    response.data = appUtils.format4View(response.data, $filter);
                //公共操作提示
                if (response.config.method == "POST" && response.data == "") {
                    appUtils.tipSuccess("提交成功！");
                    //返回!DOCTYPE html属于异常情况
                } else if (angular.isString(response.data) && response.data.indexOf("<html>") != -1) {
                    if (response.data.indexOf("404") != -1)
                        appUtils.tipError("<b>[404] 访问不到。<\/p>" + response.config.url + "<\/b><\/p>可能网络不通，或服务端不存在该资源，请稍后再试！");
                    else if (response.data.indexOf("500") != -1)
                        appUtils.tipError("<b>[500] 系统发生内部错误。<\/p>" + response.config.url + "<\/b><\/p>请稍后再试！");
                    else if (response.data.indexOf("登录页") != -1)
                        appUtils.tipError("<b>[403] 无权限访问。<\/p>" + response.config.url + "<\/b><\/p>未登录，或长时间未操作会话超时，请重新登录！");

                    return $q.reject(response);
                }
            }
            return response;
        }, function (response) {
            //异常情况
            if (response.status == 400) {
                appUtils.tipError("<b>[400] 客户端请求失败。<\/p>" + response.config.url + "<\/b><\/p>" + response.data);
            } else if (response.status == 403) {
                appUtils.tipError("<b>[403] 权限认证失败。<\/p>" + response.config.url + "<\/b><\/p>" + response.data);
            } else if (response.status == 404) {
                appUtils.tipError("<b>[404] 访问不到。<\/p>" + response.config.url + "<\/b><\/p>可能网络不通，或服务端不存在该资源，请稍后再试！");
            } else if (response.config.url.indexOf("/api/") != -1) {
                console.error(">>intercept url contains '/api/'>>resp>>", response)
                //公共操作提示
                var msg = "";
                if (response.status == 405)msg = "不允许访问的资源。";
                if (response.status == 500)msg = response.data;
                appUtils.tipError("<b>[" + response.status + "] 提交失败！<\/p>" + response.config.url + "<\/b><\/p>" + msg);
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
                console.debug(">>intercept url contains '/api/'>>" + config.url + ">>req>>", config)
            }
            return config || $q.when(config);
        }
    };
})

app.service('$$stateProxy', ['$state', '$$appState', function ($state, $$appState) {
    return {
        goto: function (state, objAsParams, location) {
            console.debug(">>>goto state>>", state);
//            console.debug(">>>item>>", appUtils.objectToParams(state));
            var _location = false;
            if (location != undefined || location != null || location != "")_location = location
            $state.go(state, {item: appUtils.objectToParams(objAsParams)}, {location: _location})
        },
        parseState: function (moduleName, entityName, listView, viewGroup, view) {
            return $$appState.parser().parseState(moduleName, entityName, listView, viewGroup, view)
        },
        gotoState: function (moduleName, entityName, listView, viewGroup, view, objAsParams, location) {
            this.goto($$appState.parser().parseState(moduleName, entityName, listView, viewGroup, view), objAsParams, location);
        },
        enum: {
            targetTypes: {
                INNER: "inner",
                SELF: "self",
                MODAL: "modal"
            }, innerViewTypes: {
                TABS: "tabs",
                STEPS: "steps",
                NONE: "none"
            }
        }
    }
}])

//---------设置全局变量-------------------//


//---------controller-------------------//
function appCtrl($scope, $http, $state, $$stateProxy, $$Data, $$MD) {
//    var defaultUser = {name:"",loginName:"",password:"",plainPassword:"",avatar:"",description:""};
    $scope.isDomReady = false;
    var $menuSidebar = $('.ui.sidebar.menu');

    var defaultUser = {};
    var init = function () {
        //#loginForm
        $('#loginForm').form({
            loginName: {
                identifier: 'loginName',
                rules: [
                    {type: 'empty', prompt: '不允许为空.'}
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                    {type: 'empty', prompt: '不允许为空.'}
                ]
            }
        });

        //sidebar 第一次更新状态时，需注册事件
        $menuSidebar.sidebar('attach events', '.launch.label');
        $menuSidebar.sidebar('attach events', '.launch.item');
    }

    init();
    //更新登录状态
    var refreshStatus = function (user) {
        $scope.currentUser = !user ? defaultUser : user;
        if (angular.isUndefined($scope.currentUser) || angular.isUndefined($scope.currentUser.id))$scope.isLogged = false;
        else $scope.isLogged = true;
        $scope.isDomReady = true;

        if ($scope.isLogged) {
            //主菜单的侧边栏展示
            $menuSidebar.sidebar('show');
            //加载应用菜单
            $scope.appList = $$Data.app.query()
        }
        else $menuSidebar.sidebar('hide');

    }
    //检查是否已登录
    $http.get($$MD.url("/api/auth/isLogged")).success(function (data) {
        refreshStatus(data);
    });


    $scope.loadModule=function(appCode)
    {
        var myapp2mod = angular.module('appCode',[]);
        myapp2mod.controller('Textcontroller',function($scope){
            var content= {};
            content.message = "Hello Hanmeimei";
            $scope.content= content;
        });
        angular.bootstrap(angular.element("#Lilei"),["Lilei"]);
    }
//    $scope.loadApp = function (href) {
//        $state.go(href)
//    }

    //加载上方的菜单,在各模块的启动程序中调用
    $scope.loadModulesMenu = function (appCode) {
        //@TODO 异常处理
        $http.get("m/api/data/app_m_" + appCode + ".json?type=m&appCode=" + appCode).success(function (data, status) {
            $scope.menuItems = data;
        });
    }


    //查看个人信息
    $scope.userProfile = function () {
        $$stateProxy.goto("sys.user.profile", $scope.currentUser);
    }

    //登录
    $scope.login = function () {
        if ($("#loginForm").form("validate form")) {
            $("#loginForm").removeClass("error");
            $http.post($$MD.url("/api/auth/login"), $scope.currentUser).success(function (data) {
                refreshStatus(data);
            });
        } else {
            $("#loginForm").addClass("error");
        }
    }

    //退出
    $scope.logout = function () {
        //当前url:window.location.href

        $http.get($$MD.url("/api/auth/logout"), $scope.currentUser).success(function (data) {
            //方式1：注销成功后，分析当前页面，解析出首页面，并重新加载
            var reloadURL = window.location.href;
            reloadURL = reloadURL.substring(0, reloadURL.indexOf("#"));
            //true:退出并刷新从服务端获取资源
            window.location.replace(reloadURL, true);
            //方式2：只是更改一下状态，但不刷新页面
            //refreshStatus(defaultUser);
        });
    }

//    //全局变更
    $scope.ctx = '/argularAppKit/webapp';


//    $scope.tipInfo=function(msg){
//        appUtils.tipInfo(msg);
//    }
//    $scope.tipError=function(msg){
//        appUtils.tipError(msg);
//    }
//    $scope.tipSuccess=function(msg){
//        appUtils.tipSuccess(msg);
//    }
//    $scope.tipWarm=function(msg){
//        appUtils.tipWarm(msg);
//    }
}


//-------------UI 初始化---------------//
$(document).ready(function () {

//    $("#header").headroom({
//        "tolerance": 5,
//        "offset": 205,
//        "classes": {
//            "initial": "animated",
//            "pinned": "slideDown",
//            "unpinned": "slideUp",
//            "top": "headroom--top",
//            "notTop": "headroom--not-top"
//        }
//    });
//    console.debug(">>>$$$$$$$$$$$",$("#header"));
});

