/**
 * Created by hongxueqian on 14-3-3.
 */
function sys($state) {

}

function sysConfigCtrl($scope, $http, $filter,$routeParams) {
    $scope.loadSysPage=function(page,target){
        //若只有一个参数则target=page
        if(!target)target = page;
        //console.debug("$scope." + page + "='m/sys/views/" + page + ".html'")
        eval("$scope."+target+"='m/sys/views/"+page+".html'");
    }
    $scope.toStep=function(stepName){
        $scope.step=stepName;
        $scope.loadSysPage("config_"+stepName,"sys_config")
    }

//    eval("function test(){console.debug('eval in function success!')};")
//     test();
}



function sysConfigSetAppCtrl($scope,$http){

}
function sysConfigTmplCtrl($scope,$http){

}

function sysConfigDataSourceCtrl($scope, $http, $filter,$routeParams) {
    //用于展示列表的选中状态
    $scope.select = function (index) {
        $scope.selectedIndex = index;
    }
}

function sysConfigDataSourceDetailCtrl(){

}