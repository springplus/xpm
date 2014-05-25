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
 * 支持右边页面是简单的单个页面，或是tabs页面
 * @param $$stateProxy
 * @param $scope
 * @param $$Data
 * @param config
 * @param roleMixListDetailViews 字符型数组，第一项为默认打开的页面名称（文件名称，不包括文件类型后缀）
 */
function tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,config) {
    //设置所有页面、设置默认页面
    //angular.isUndefined(config.detailViews)?'mixList_detail':
    var defaultView = config.detailViews[0];
    var defaultViewFullName = defaultView.parentView+"."+defaultView.fileName;
    //当前选中的项
    $scope.currentItem = {};
    var __moduleName = config.moduleName;
    var __entityName= config.entityName;
    $scope.listTitle=config.list.title;
    $scope.refresh = function () {
        $scope.listData = eval("$$Data."+__entityName+".query()");
        //TODO 按列表中的查询指定列进行过滤
        $scope.listHeader = config.list.header;
    }

    $scope.addItem = function () {
        $scope.switch(defaultViewFullName)
        $scope.currentItem = {};
    }
    eval("$scope."+__entityName+"Directive= new appUtils.Directive($scope, 'ngx_list_"+__entityName+"', {clickItem: clickItem, doRemoveItem: doRemoveItem})")
    $scope.removeItem = function(){
        eval("$scope."+__entityName+"Directive.removeItem()");
    }
    function doRemoveItem(event, msg) {
        eval("$$Data."+__entityName+".delete(msg.item, $scope.refresh)");
        $scope.addItem();
        $scope.currentItem = {};
    }
    function clickItem(event, msg) {
        $scope.currentItem = msg.item;
        $scope.switch(defaultViewFullName)
    }

    //list右边页面包括了detail等多个页面时，可用该方法进行切换
    $scope.switch = function (tabName) {
        console.debug(">>>switch tab to tabName>>>",tabName)
//        console.debug(">>>$scope.currentItem>>>",$scope.currentItem)

        $$stateProxy.goto(__moduleName+"."+__entityName+"."+tabName, $scope.currentItem)
    }
    $scope.refresh();
}


function tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,config) {
    var __moduleName = config.moduleName;
    var __entityName= config.entityName;
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
 * TODO 模板应是在打开app时加载，不应每次通过http再获取，可以降低接口的复杂度
 * 最简单的增删改查模板
 * @param $http
 * @param $timeout
 * @param config
 * @returns {*}
 */
function tmpl_crud_view(tmplName,$http,config){
    var url = "m/tmpl/crud/"+tmplName+".mustache";
    console.debug(">>>get html template from:"+url);
    return $http.get(url).then(function (response) {
        console.debug(">>>Mustache.render>>>模板转换变量>>>",config)
        console.debug(">>>Mustache.render>>>转换前模板>>>")
        console.debug(response.data)
        var result =  Mustache.render(response.data,config)
        console.debug(">>>Mustache.render>>>转换后模板>>>")
        console.debug(result)
        return result;
    });
}

function tmpl_crud_list_view($http,config) {
    return tmpl_crud_view(config.list.view,$http,config);
}

function tmpl_crud_index_view($http,config) {
    return tmpl_crud_view('index',$http,config);
}

//function tmpl_crud_view3($http,config){
//    var url = "m/tmpl/crud/"+config.template+".mustache";
//    console.debug(">>>get html template from:"+url);
//    return $http.get(url).then(function (response) {
//        console.debug(">>>Mustache.render>>>模板转换变量>>>",config)
//        console.debug(">>>Mustache.render>>>转换前模板>>>")
//        console.debug(response.data)
//        var result =  Mustache.render(response.data,config)
//        console.debug(">>>Mustache.render>>>转换后模板>>>")
//        console.debug(result)
//        return result;
//    });
//}

//function tmpl_crud_view2($http,config){
//    var templateName = config.template;
//    var url = "m/tmpl/crud/"+templateName+"_tmpl.html";
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
//function replaceHtmlTemplate(config,response){
//    console.debug(">>>HTML模板替换内容>>>",config)
//    var __entityName = config.entityName;
//    var __moduleName = config.moduleName;
//    //第二个参数中的 g 表示全部匹配,i表示忽略大小写
//    var regExpModuleName = new RegExp("_moduleName","gi");
//    var regExpEntityName = new RegExp("_entityName","gi");
//    var result =  response.data.replace(regExpModuleName,__moduleName).replace(regExpEntityName, __entityName);
//    console.debug(">>>HTML模板替换结果：>>>");
//    console.debug(result);
//    return result;
//}
