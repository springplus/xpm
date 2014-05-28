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
function tmpl_ctrl_module_entity_mixList($scope, $$Data, $$stateProxy, config) {
    var activeView = findActiveDetailView(config);

    var activeViewFullName = activeView.parentView + "." + activeView.fileName;
    //当前选中的项
    $scope.currentItem = {};
    $scope.tab = activeView.fileName;
    var __moduleName = config.moduleName;
    var __entityName = config.entityName;
    $scope.listTitle = config.list.title;
    $scope.refresh = function () {
        $scope.listData = eval("$$Data." + __entityName + ".query()");
        //TODO 按列表中的查询指定列进行过滤
        $scope.listHeader = config.list.header;
    }

    $scope.addItem = function () {

        clearCurrentItem()
        $scope.switch(activeViewFullName)
    }
    eval("$scope." + __entityName + "Directive= new appUtils.Directive($scope, 'ngx_list_" + __entityName + "', {clickItem: clickItem, doRemoveItem: doRemoveItem})")
    $scope.removeItem = function () {
        eval("$scope." + __entityName + "Directive.removeItem()");
    }
    function doRemoveItem(event, msg) {
        eval("$$Data." + __entityName + ".delete(msg.item, $scope.refresh)");
        $scope.addItem();
    }

    function clickItem(event, msg) {
        $scope.currentItem = msg.item;
        $scope.switch(activeViewFullName)
    }

    function clearCurrentItem() {
        for (var index in $scope.currentItem) {
            $scope.currentItem[index] = null;
        }
    }

    //list右边页面包括了detail等多个页面时，可用该方法进行切换
    $scope.switch = function (tabName) {
        $scope.tab = tabName.substring(tabName.lastIndexOf(".") + 1);
        console.debug(">>>switch tab to tabName>>>", $scope.tab)
        $$stateProxy.goto(__moduleName + "." + __entityName + "." + tabName, $scope.currentItem)
    }
    $scope.refresh();
}
function findActiveDetailView(config) {
    console.debug(">>>findActiveDetailView from config>>>", config)
    for (var i in config.detailViews) {
        if (config.detailViews[i].active)return config.detailViews[i]
    }
    console.error("找不到状态为active的view，请检查配置是否正确！", config);
    return undefined;
}

function tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, config) {
    var __moduleName = config.moduleName;
    var __entityName = config.entityName;
    $scope.refresh = function () {
        console.debug("$stateParams", $stateParams);
        if ($stateParams && $stateParams.item) {
            var item = appUtils.paramsToObject($stateParams.item);
            //没传id过来，说明是进入新增页面
            if (item.id > 0)
                $scope.item = eval("$$Data." + __entityName + ".get(item)");
            else $scope.item = {};
        }
    }
    $scope.refresh();

    $scope.saveItem = function () {
        if ($("#" + __entityName + "Form").form('validate form')) {
            $scope.item = eval("$$Data." + __entityName + ".save(appUtils.convertName($scope.item), $scope.$parent.refresh)");
            $scope.$parent.currentItem = $scope.item;
        }
    }

    function initFormValidate() {
        console.debug(">>>initFormValidate>>>", __entityName)
        var activeView = findActiveDetailView(config)
        $(document).ready(function () {
            $("#" + __entityName + "Form").form(activeView.templateData, {
                inline: true,
                on: 'blur'
            })
        });
    }

    initFormValidate();
}


/**
 * TODO 模板应是在打开app时加载，不应每次通过http再获取，可以降低接口的复杂度
 * 最简单的增删改查模板
 * @param $http
 * @param $timeout
 * @param config
 * @returns {*}
 */
function tmpl_crud_view(tmplName, $http, config) {
    var url = "m/tmpl/crud/" + tmplName + ".mustache";
    console.debug(">>>get html template from:" + url);
    return $http.get(url).then(function (response) {
        //console.debug(">>>Mustache.render>>>模板转换变量>>>", config)
        //console.debug(">>>Mustache.render>>>转换前模板>>>")
        //console.debug(response.data)
        var result = Mustache.render(response.data, config)
        //console.debug(">>>Mustache.render>>>转换后模板>>>")
        //console.debug(result)
        return result;
    });
}

function tmpl_crud_list_view($http, config) {
    return tmpl_crud_view(config.list.view, $http, config);
}
