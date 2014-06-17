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
 */
function tmpl_ctrl_module_entity_mixGrid($scope, $$Data, $$stateProxy, config) {
    $scope.targetTypes = $$stateProxy.enum.targetTypes;
    $scope.innerViewTypes = $$stateProxy.enum.innerViewTypes;

    //当前选中的项
    $scope.currentItem = {};
    $scope.currentDetailView = "";
    $scope.viewTarget = $scope.targetTypes.INNER;
    $scope.innerViewType = $scope.innerViewTypes.NONE;

    var __moduleName = config.moduleName;
    var __entityName = config.entityName;

    //grid gridDetail
    $scope.currentGrid="grid";
    //TODO: 从config.ngGridOptions中获取配置覆盖默认值
    $scope["ngGrid_"+__entityName+"Options"] = {
        data: 'listData',
        multiSelect: false,
        enableCellEditOnFocus: false,
        selectedItems: $scope.selectedItems,
        columnDefs:config.ngGridOptions.columnDefs,
        afterSelectionChange: function(rowItem) {
            //每次点击会调用两次，第一次为上一次的选择行

            //第二次为当前点击行
        }
    }
    console.debug(">>>>>","ngGrid_"+__entityName+"Options")


    $scope.refresh = function () {
        $scope.listData = eval("$$Data." + __entityName + ".query()");
        //TODO 按列表中的查询指定列进行过滤
        $scope.listHeader = config.list.header;
    }

    $scope.addItem = function (target, viewGroup, view) {
        clearCurrentItem()
        $scope.doAction(target, viewGroup, view)
    }
    eval("$scope." + __entityName + "Directive= new appUtils.Directive($scope, 'ngx_list_" + __entityName + "', {clickItem: clickItem, doRemoveItem: doRemoveItem})")
    $scope.removeItem = function () {
        eval("$scope." + __entityName + "Directive.removeItem()");
    }
    function doRemoveItem(event, msg) {
        eval("$$Data." + __entityName + ".delete(msg.item, $scope.reload)");
    }

    $scope.reload = function () {
        $$stateProxy.gotoState(__moduleName, __entityName, config.list.view, null, null, null, null)
        $scope.refresh();
    }

    function clickItem(event, msg) {
        $scope.currentItem = msg.item;
        $scope.doAction($scope.targetTypes.INNER, $scope.innerViewTypes.TABS)
    }

    $scope.doAction = function (target, viewGroup, view) {
        if (!view) {
            if (!$scope.currentDetailView) {
                //找出默认
                view = tmpl_ctrl_findActiveDetailView(config, viewGroup);
                if (view)$scope.currentDetailView = view.fileName;
                console.debug("找取默认的view:", $scope.currentDetailView);
            }
        } else {
            $scope.currentDetailView = view;
        }


        if ($scope.targetTypes.INNER == target) {
            $scope.viewTarget = target;
            $scope.innerViewType = viewGroup;
            //tabs
//            console.debug("parseState", $$stateProxy.parseState(__moduleName,__entityName,config.list.view,viewGroup,_view))
            var stateStr = $$stateProxy.parseState(__moduleName, __entityName, config.list.view, viewGroup, $scope.currentDetailView)
            $$stateProxy.goto(stateStr, $scope.currentItem)
        } else if ($scope.targetTypes.SELF == target) {
            $scope.viewTarget = target;

        } else if ($scope.targetTypes.MODAL == target) {
            $scope.viewTarget = target;

        } else {
            console.error(">>>不支持的target值>>>" + target + ">>>当前支持的类型>>", $scope.targetTypes)
        }
    }

    function clearCurrentItem() {
        for (var index in $scope.currentItem) {
            $scope.currentItem[index] = null;
        }
    }

    $scope.isLastStep = function (currentStepName) {
        var matchAt = 0;
        for (var stepViewIndex in config.detailViews.steps) {
            var stepView = config.detailViews.steps[stepViewIndex];
            if (currentStepName == stepView.fileName) {
                matchAt = stepViewIndex;
                break;
            }
        }
        if (matchAt == config.detailViews.steps.length - 1) {
            return true;
        }
        return false;
    }

    $scope.nextStep = function (currentStepName) {
        //找出下一步
        var _stepName= currentStepName?currentStepName:$scope.currentDetailView;
        var _nextStepName = ""
        var matchAt = 0;//默认当前为第一步
        for (var stepViewIndex in config.detailViews.steps) {
            var stepView = config.detailViews.steps[stepViewIndex];
            // console.debug(">>>currentStepName："+currentStepName+">>>stepView:",stepView)
            if (_stepName == stepView.fileName) {
                matchAt = stepViewIndex;
                break;
            }
        }
        if (matchAt != config.detailViews.steps.length - 1) {
            //不是最后一步，则可转到下一步
            matchAt++;
            _nextStepName = config.detailViews.steps[matchAt].fileName;
        }
        $scope.doAction($scope.targetTypes.INNER, $scope.innerViewTypes.STEPS, _nextStepName)
    }

    $scope.switchTab = function (view) {
        $scope.doAction($scope.targetTypes.INNER, $scope.innerViewTypes.TABS, view)
    }
    $scope.refresh();
}
function tmpl_ctrl_findActiveDetailView(config, viewGroup) {
    try {
        var viewGroups = config.detailViews[viewGroup];
        if (!viewGroups) {
            console.error("未配置viewGroup：" + viewGroup + "即detailViews无该属性。", config)
            return undefined;
        }
        console.debug(">>>tmpl_ctrl_findActiveDetailView from config>>>", config)
        for (var i in viewGroups) {
            if (viewGroups[i].active)return viewGroups[i]
        }
        console.debug("找不到状态为active的view，采用第一个作为当前View！", config);
        return  viewGroups[0];
    } catch (e) {
        console.error(e.message, e.stack)
    }
    return undefined;
}
function tmpl_ctrl_module_entity_mixList_steps_detail($scope, $$Data, $stateParams, config) {
    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, config, "steps");
}
function tmpl_ctrl_module_entity_mixList_tabs_detail($scope, $$Data, $stateParams, config) {
    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, config, "tabs");
}
function tmpl_ctrl_module_entity_mixList_none_detail($scope, $$Data, $stateParams, config) {
    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, config, "none");
}
function tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, config, viewGroup) {
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
        var activeView = tmpl_ctrl_findActiveDetailView(config, viewGroup)
        $(document).ready(function () {
            $("#" + __entityName + "Form").form(activeView.templateData, {
                inline: true,
                on: 'blur'
            })
        });
    }

    initFormValidate();
}
