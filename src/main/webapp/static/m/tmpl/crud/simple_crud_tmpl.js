/**
 * Created by hongxq on 2014/5/8.
 * 模板方法命名规则,如tmpl_ctrl_module_entity_mixList
 * tmpl:表示模板
 * ctrl:表示该模板方法用于controller
 * module:是模块名
 * entity:是实体名
 * mixList:controller的分类命名，此例中表示左边列表，右边详情的页面
 *
 * 方法配置信息参数config示例：
 * {moduleName:'sys',entityName:'Role',list:{title:角色列表,header:{name: '角色名称', code: '角色编码'}}}
 */


/**
 * 简单CRUD列表controller模板，
 * @param $$stateProxy
 * @param $scope
 * @param $$Data
 * @param config
 *
 */
function tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,config) {
    var __moduleName = config.moduleName;
    var __entityName= config.entityName;
    var __lowEntityName = config.entityName.toLowerCase();
    $scope.listTitle=config.list.title;
    $scope.refresh = function () {
        $scope.listData = eval("$$Data."+__entityName+".query()");
        $scope.listHeader = config.list.header;
    }

    $scope.addItem = function () {
        $$stateProxy.goto(__moduleName+"."+__lowEntityName+".mixList.detail");
    }
    eval("$scope."+__lowEntityName+"Directive= new appUtils.Directive($scope, 'ngx_list_"+__lowEntityName+"', {clickItem: clickItem, doRemoveItem: doRemoveItem})")
    $scope.removeItem = function(){
        eval("$scope."+__lowEntityName+"Directive.removeItem()");
    }
    function doRemoveItem(event, msg) {
        eval("$$Data."+__entityName+".delete(msg.item, $scope.refresh)");
        $scope.addItem();
    }
    function clickItem(event, msg) {
        $$stateProxy.goto(__moduleName+"."+__lowEntityName+".mixList.detail", msg.item)
    }
    $scope.refresh();
}


function tmpl_ctrl_module_entity__mixList_detail($scope,$$Data,$stateParams,config) {
    var __moduleName = config.moduleName;
    var __entityName= config.entityName;
    var __lowEntityName = config.entityName.toLowerCase();
    $scope.refresh = function () {
        if ($stateParams && $stateParams.item)
            $scope.item = eval("$$Data."+__entityName+".get(appUtils.paramsToObject($stateParams.item))");
    }
    $scope.refresh();

    $scope.saveItem = function () {
        if ($("#"+__lowEntityName+"Form").form('validate form')) {
            $scope.item = eval("$$Data."+__entityName+".save(appUtils.convertName($scope.item), $scope.$parent.refresh)");
        }
    }
}


/**
 * 模板文件
 * @param $http
 * @param $timeout
 * @returns {*}
 */
function tmpl_module_entity_mixList($http,$timeout) {
    var url = "m/tmpl/crud/mixList_tmpl.html"
    console.debug(">>>get html template from:"+url);
    return $http.get(url).then(function (response) {
        //第二个参数中的 g 表示全部匹配,i表示忽略大小写
        var regModuleName = new RegExp("_moduleName","gi");
        var regLowEntityName = new RegExp("_lowEntityName","gi");
        var result =  response.data.replace(regModuleName, 'sys').replace(regLowEntityName, 'role');
        console.debug(">>>response>>",result);
        return result;
    });
    //return "失败";
//                return $timeout(function () {
//                    return '<h1>' + $stateParams.contactId + '</h1>'
//                }, 100);
}