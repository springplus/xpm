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
    var __entityName = config.entityName.toLowerCase();
    $scope.listTitle=config.list.title;
    $scope.refresh = function () {
        $scope.listData = eval("$$Data."+__entityName+".query()");
        //TODO 按列表中的查询指定列进行过滤
        $scope.listHeader = config.list.header;
    }

    $scope.addItem = function () {
        $$stateProxy.goto(__moduleName+"."+__entityName+".mixList.detail");
    }
    eval("$scope."+__entityName+"Directive= new appUtils.Directive($scope, 'ngx_list_"+__entityName+"', {clickItem: clickItem, doRemoveItem: doRemoveItem})")
    $scope.removeItem = function(){
        eval("$scope."+__entityName+"Directive.removeItem()");
    }
    function doRemoveItem(event, msg) {
        eval("$$Data."+__entityName+".delete(msg.item, $scope.refresh)");
        $scope.addItem();
    }
    function clickItem(event, msg) {
        $$stateProxy.goto(__moduleName+"."+__entityName+".mixList.detail", msg.item)
    }
    $scope.refresh();
}


function tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,config) {
    var __moduleName = config.moduleName;
    var __entityName= config.entityName;
    var __entityName = config.entityName.toLowerCase();
    $scope.refresh = function () {
        if ($stateParams && $stateParams.item)
            $scope.item = eval("$$Data."+__entityName+".get(appUtils.paramsToObject($stateParams.item))");
    }
    $scope.refresh();

    $scope.saveItem = function () {
        if ($("#"+__entityName+"Form").form('validate form')) {
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
//function tmpl_module_entity_mixList($http,$timeout,config) {
//    var __entityName = config.entityName.toLowerCase();
//    var url = "m/tmpl/crud/mixList_tmpl.html"
//    console.debug(">>>get html template from:"+url);
//    return $http.get(url).then(function (response) {
//        //第二个参数中的 g 表示全部匹配,i表示忽略大小写
//        var regExpModuleName = new RegExp("_moduleName","gi");
//        var regExpLowEntityName = new RegExp("_lowEntityName","gi");
//        var result =  response.data.replace(regExpModuleName, 'sys').replace(regExpLowEntityName, __entityName);
//        console.debug(">>>替换模板>>tmpl_module_entity_mixList>>替换结果>>");
//        console.debug(result);
//
//        return result;
//    });
//}
//

/**
 * TODO 模板应是在打开app时加载，不应每次通过http再获取，可以降低接口的复杂度
 * 最简单的增删改查模板
 * @param $http
 * @param $timeout
 * @param config
 * @returns {*}
 */
function tmpl_crud_view($scope,$http,config){
    var templateName = config.template;
    var url = "m/tmpl/crud/"+templateName+"_tmpl.html";
    console.debug(">>>get html template from:"+url);
    return $http.get(url).then(function (response) {
        return replaceHtmlTemplate($scope,config,response);
    });
}

/**
 * 模板文件
 * @param $http
 * @param $timeout
 * @returns {*}
 */
//function tmpl_$module_$entity_index($http,$timeout,config) {
//    var url = "m/tmpl/crud/index_tmpl.html";
//    console.debug(">>>get html template from:"+url);
//    return $http.get(url).then(function (response) {
//        return replaceHtmlTemplate(config,response);
//    });
//}

/**
 * 模板基础工具，依据配置的关键字进行替换
 * @param config  eg:{moduleName: 'sys',entityName: 'role', template: 'index'}
 * @param response
 * @returns {XML|string}
 */
function replaceHtmlTemplate($scope,config,response){
    console.debug(">>>HTML模板替换内容>>>",config)
    var __entityName = config.entityName.toLowerCase();
    var __moduleName = config.moduleName;
    //第二个参数中的 g 表示全部匹配,i表示忽略大小写
    var regExpModuleName = new RegExp("_moduleName","gi");
    var regExpLowEntityName = new RegExp("_lowEntityName","gi");
    var result =  response.data.replace(regExpModuleName,__moduleName).replace(regExpLowEntityName, __entityName);
    console.debug(">>>HTML模板替换结果：>>>");
    console.debug(result);
    return result;
}