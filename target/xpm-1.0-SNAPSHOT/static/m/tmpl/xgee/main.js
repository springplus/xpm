/**
 * Created by hongxq on 2014/6/27.
 */


/**
 * 简单CRUD列表controller模板，
 * 支持右边页面是简单的单个页面，或是tabs页面
 * @param $$stateProxy
 * @param $scope
 * @param moduleData
 * @param config
 */
function mainCtrlTmpl($scope,$$Data, moduleData, $$stateProxy, config) {

    $scope.actions = $$stateProxy.enum.actions;
    $scope.containers = $$stateProxy.enum.containers;
    //当前选中的项
    $scope.currentItem = {};
    $scope.currentDetailView = "";
    $scope.containerName = $scope.containers.NONE;


    var __moduleName = config.moduleName;
    var __resName = config.resName;
    $scope.refresh = function () {
        $scope.doAction(null,$scope.containerName,$scope.currentDetailView)
    }

    $scope.reload = function () {
        $$stateProxy.gotoState(__moduleName, __resName, config.view.name, null, null, null, null)
        $scope.refresh();
    }

    $scope.doAction = function (action, containerName, view) {
        if (!view) {
            if (!$scope.currentDetailView) {
                //找出默认
                view = mainFindActiveDetailView(config, containerName);
                if (view)$scope.currentDetailView = view.name;
                console.debug("找取默认的view:", $scope.currentDetailView);
            }
        } else {
            $scope.currentDetailView = view;
        }
        $scope.containerName = containerName;
        var templateDir = '';
        for (var viewIndex in config.view.containers[containerName]) {
            var v = config.view.containers[containerName][viewIndex];
            if (v.name == view) {
                templateDir = v.template ? v.template.dir : '';
                break;
            }
        }
        var stateStr = $$stateProxy.parseState(__moduleName, __resName, config.view.name, containerName, $scope.currentDetailView, templateDir)
        $$stateProxy.goto(stateStr, $scope.currentItem)

    }

    function clearCurrentItem() {
        for (var index in $scope.currentItem) {
            $scope.currentItem[index] = null;
        }
    }

    $scope.isLastStep = function (currentStepName) {
        var matchAt = 0;
        for (var stepViewIndex in config.view.containers.steps) {
            var stepView = config.view.containers.steps[stepViewIndex];
            if (currentStepName == stepView.name) {
                matchAt = stepViewIndex;
                break;
            }
        }
        if (matchAt == config.view.containers.steps.length - 1) {
            return true;
        }
        return false;
    }

    $scope.nextStep = function (currentStepName) {
        //找出下一步
        var _stepName = currentStepName ? currentStepName : $scope.currentDetailView;
        var _nextStepName = ""
        var matchAt = 0;//默认当前为第一步
        for (var stepViewIndex in config.view.containers.steps) {
            var stepView = config.view.containers.steps[stepViewIndex];
            // console.debug(">>>currentStepName："+currentStepName+">>>stepView:",stepView)
            if (_stepName == stepView.name) {
                matchAt = stepViewIndex;
                break;
            }
        }
        if (matchAt != config.view.containers.steps.length - 1) {
            //不是最后一步，则可转到下一步
            matchAt++;
            _nextStepName = config.view.containers.steps[matchAt].name;
        }
        $scope.doAction(null, $scope.containers.STEPS, _nextStepName)
    }

    $scope.switchTab = function (view) {
        $scope.doAction(null, $scope.containers.TABS, view)
    }
    $scope.refresh();
}
function mainFindActiveDetailView(config, containerName) {
    try {
        if (!containerName) {
            console.error("未配置containerName：" + containerName + ",请检查controller中是否有传该参数，如mainDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config, \"tabs\")。")
            return undefined;
        }

        var container = config.view.containers[containerName];
        if (!container) {
            console.error("未配置containerName：" + containerName + "即view.containers无该属性。", config)
            return undefined;
        }
        console.debug(">>>mainFindActiveDetailView from config>>>", config)
        for (var i in container) {
            if (container[i].active)return container[i]
        }
        console.debug("找不到状态为active的view，采用第一个作为当前View！", config);
        return  container[0];
    } catch (e) {
        console.error(e.message, e.stack)
    }
    return undefined;
}
function mainStepsDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config) {
    return _mainDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config, "steps");
}
function mainTabsDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config) {
    return _mainDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config, "tabs");
}
function mainNoneDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config) {
    return _mainDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config, "none");
}
function _mainDetailCtrlTmpl($scope,$$Data, moduleData, $stateParams, config, containerName) {
    var __moduleName = config.moduleName;
    var __resName = config.resName;
    $scope.refresh = function () {
        console.debug("$stateParams", $stateParams);
        if ($stateParams && $stateParams.item) {
            var item = xgeeUtils.paramsToObject($stateParams.item);
            //没传id过来，说明是进入新增页面
            if (item.id > 0)
                $scope.item = eval("moduleData." + __resName + ".get(item)");
            else $scope.item = {};
        }
    }
    $scope.refresh();

    $scope.saveItem = function () {
        if ($("#" + __resName + "Form").form('validate form')) {
            $scope.item = eval("moduleData." + __resName + ".save(xgeeUtils.convertName($scope.item), $scope.$parent.refresh)");
            $scope.$parent.currentItem = $scope.item;
        }
    }

    function initFormValidate() {
        var activeView = mainFindActiveDetailView(config, containerName)
        if (activeView.template && activeView.template.data)
            $(document).ready(function () {
                $("#" + __resName + "Form").form(activeView.template.data, {
                    inline: true,
                    on: 'blur'
                })
            });
    }

    initFormValidate();
}
