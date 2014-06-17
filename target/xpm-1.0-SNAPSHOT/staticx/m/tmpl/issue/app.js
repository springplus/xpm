var issueApp = angular.module('issueApp', ['ngRoute']);

issueApp.config(function ($routeProvider) {
    $routeProvider.when('/issueTmpl/:id', {
        templateUrl: 'm/tmpl/issue/views/main.html',
        controller: issueMainCtrl
    })
})


//issueApp.factory('myInterceptor', function ($q, notifyService, errorLog) {
//    return function (promise) {
//        return promise.then(function (response) {
//            console.debug("success")
//            return response;
//        }, function (response) {
//            //notify
//            notifyService(response);
//            //
//            errorLog(response);
//            return $q.reject(response);
//        });
//    }
//});
//
//$httpProvider.responseInterceptors.push('myInterceptor')