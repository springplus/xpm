/**
 * Created by hongxueqian on 14-7-11.
 */
function ui_design_index($scope, $state, $$Data) {
    function init() {
        $scope.$alias$ = {}
        $scope.$parent.loadModulesMenu('ui');

//        $scope.layoutNorthMinHeight = 100
//        var layoutWestHeight = $(window).height() - $("#header").height() - $("#layoutNorth").height()
//        $scope.layoutWestHeight = layoutWestHeight;
    }
//    $scope.index = url($state.current.data);
    //TODO  从服务器加载配置by $$stateProxy.state.current.data
    console.debug(">>>$$stateProxy.state.current.data>>>", $state.current.data)
    var viewConfig = {name: "views_layout_mixListPlus", alias: "sys_app", dir: "", renderTo: "index",
        views: [
            {name: "views_list_simple", alias: "sys_app_list", dir: "", renderTo: "westView",
                title: '应用列表',
                fields: [
                    {name: "id", displayName: '序号', width: "10%"},
                    {name: "name", displayName: '名称', width: "30%"},
                    {name: "code", displayName: '应用编码'}
                ],
                actions: [
                    {name: 'create', displayName: '添加', target: 'sys_app_tabs.sys_app_config'},
                    {name: 'delete', displayName: '删除', target: 'none'}
                ],
                list: {
                    click: {name: 'read', displayName: '查看/编辑', target: 'sys_app_tabs.sys_app_config'}
                },
                data: [
                    {xql: 'res:sys_find_appDict', value: {}, bindTo: "listData"}
                ]
            },
            {name: "views_tabs_simple", alias: "sys_app_tabs", dir: "", renderTo: "eastView",
                tabs: [
                    {name: 'detail', displayName: '配置', target: 'sys_app_config'},
                    {name: 'parameter', displayName: '参数配置', target: 'sys_app_parameter'},
                    {name: 'test', displayName: '配置结果测试', target: 'sys_app_test'}
                ],
                views: [
                    {name: "views_detail_simple", alias: "sys_app_config", dir: "", renderTo: "tabView",
                        actions: [
                            {name: 'save', displayName: '保存', data: [
                                {xql: 'entity:sys.app', bindFrom: "item"}
                            ]}
                        ],
                        form: appForm,
                        data: [
                            {xql: 'form:sys_app_form', value: {}, bindTo: "formData"}
                        ]
                    },
                    {name: "views_detail_simple2", alias: "sys_app_parameter", dir: "", renderTo: "tabView", type: "html"},
                    {name: "views_detail_simple3", alias: "sys_app_test", dir: "", renderTo: "tabView", type: "html"}
                ]
            },
            {name: "views_design_north", alias: "views_design_north", dir: "", renderTo: "northView"}
        ]
    }
    var cfgLoadFromRemote = viewConfig;

    /**
     *
     * @param targetAliases alias,alias,alias
     */
    $scope.onAction = function (srcAliasStr, targetAliases) {

    }
    $scope.configView = function (srcAliasStr, changedAliasStr) {
        //TODO 从配置页面中获取配置的信息
        for (var i in viewConfig.views) {
            if ($scope.cfg.views[i].alias == srcAliasStr) {
                var targetView = $scope.cfg.views[i]
                //TODO 改成changedAliasStr
                targetView.alias = "views_query_simple"
                targetView.name = "views_query_simple"
                $scope[targetView.renderTo] = url(targetView)
                break;
            }
        }
    }
    /**
     * @param srcAliasStr
     * @param targetAliasesStr alias,alias,alias...
     */
    $scope.openView = function (srcAliasStr, targetAliasesStr, params) {
//        console.debug(">>>srcAliasStr:" + srcAliasStr + ">>>targetAliasesStr:" + targetAliasesStr + ">>>params", params)
        var targetAliases = targetAliasesStr.split(",")
        for (var i in targetAliases) {
            var targetAlias = targetAliases[i];
            //如果target有无点号，则取当前srcAliasStr下的view,否则按点号按层进行解析
            var namespaces = targetAlias.split(".");
            if (namespaces.length <= 2) {
                var parentAlias = srcAliasStr;
                var targetAlias = namespaces[0];
                if (namespaces.length == 2) {
                    parentAlias = namespaces[0];
                    targetAlias = namespaces[1];
                }
            } else {
                console.error("target:" + targetAliasesStr + "格式不正确，应为alias,alias,alias...每个alias的格式为：parentAlias.alias或alias。")
            }
            //查找找到目标view
            for (var viewIndex in $scope[parentAlias].cfg.views) {
                var targetView = $scope[parentAlias].cfg.views[viewIndex];
//                console.debug(targetAlias + " =? ", targetView.alias)
                if (targetAlias == targetView.alias) {
                    $scope[targetView.renderTo] = url(targetView)
                    $scope[targetView.alias].item = params.item;
                }
            }
        }
    }

    function id() {
        return Math.random() * 100000 + "_" + new Date().getMilliseconds()
    }

    function url(cfg) {
        var dir = cfg.dir ? cfg.dir + "/" : "";
        var ext = cfg.type ? ".html" : ".mustache?alias=" + getAlias(cfg);
        return "m/ui/design/" + dir + cfg.name + ext
    }

    /**
     * 渲染视图及子视图
     * @param cfg
     * @param $scope
     * @param $$Data
     */
    function renderAll(cfg, $scope, $$Data) {
        if (cfg) {
            $scope[cfg.renderTo] = url(cfg)
            var alias = getAlias(cfg)
            $scope[alias] = {};
            $scope[alias].cfg = cfg;
//            var $injector = angular.injector();
//            var ctrl = $injector.invoke(window[cfg.name],this,{owner:$scope[alias]});
            //TODO window换成是所有views_xx_xx的owner
            var ctrl = undefined;
            if(window[cfg.name]){
                ctrl = eval("new "+cfg.name+"($scope,$$Data)")
//                ctrl = fn.apply(this,[$scope,$$Data]);
            }else{
                console.warn(">>>未配置视图的同名函数:", cfg.name)
            }
            console.debug(">>>cfg>>",cfg)
            console.debug(">>>ctrl>>>",ctrl);
            loadData(cfg, $scope, $$Data);

//            if (ctrl) {
//                $scope[alias].ctrl = ctrl;
//                if (angular.isFunction(ctrl.init))
//                    ctrl.init($scope[alias]);
//                loadData(cfg, $scope, $$Data);
//                if (angular.isFunction(ctrl.load))
//                    ctrl.load();
//            }

            //递归render子视图
            if (cfg.views && angular.isArray(cfg.views))
                for (var i in cfg.views) {
                    renderAll(cfg.views[i], $scope, $$Data)
                }
        }
    }

    //渲染当前视图，不包括子视图
    function renderLazyView(cfg, $scope, $$Data) {

    }

//    function renderAll(cfg, $scope, $$Data) {
//        if (cfg.views)
//            for (var i in cfg.views) {
//                $scope[cfg.views[i].renderTo] = url(cfg.views[i])
//                var alias = getAlias(cfg.views[i])
//                $scope[alias] = {};
//                $scope[alias].cfg = cfg.views[i];
//                try {
//                    var viewController = eval(cfg.views[i].name + "($scope,$$Data)");
//                    $scope[alias].ctrl = viewController;
//                    renderAll(cfg.views[i], $scope, $$Data)
//                    if (angular.isFunction(viewController.init))
//                        viewController.init(cfg.views[i]);
//                    loadData(cfg.views[i], $scope, $$Data);
//                    if (angular.isFunction(viewController.load))
//                        viewController.load(cfg.views[i]);
//                } catch (e) {
//                    if (e.stack.indexOf("Object.eval") != -1)
//                        console.error(">>>未配置视图的同名函数:", cfg.views[i].name)
//                    else
//                        console.error(e.stack)
//                }
//            }
//    }

    function getAlias(cfg) {
        return cfg.alias ? cfg.alias : cfg.name;
    }

    /**
     * 加载当前视图的数据，不加载子视图数据
     * @param cfg
     * @param $scope
     * @param $$Data
     * @Param isIgnoreLazyLoad true:不考虑lazyload属性，强行进行加载
     */
    function loadData(cfg, $scope, $$Data) {
        var alias = getAlias(cfg)
//        var _isIgnoreLazyLoad = isIgnoreLazyLoad?true:false;
        if (cfg.data) {
            for (var i in cfg.data) {
                var dataItem = cfg.data[i];
                //TODO 遍历所有的xql属性，查看是否为lazyLoad,否的话则即刻加载
                //(_isIgnoreLazyLoad?true:!dataItem.lazyLoad)&&
                if (dataItem.xql) {
                    var xqlConfig = xgeeUtils.xql.parse(dataItem.xql);
                    //TODO 同一个KEY 存在不同参数的情况
                    var bindTo = dataItem.bindTo ? dataItem.bindTo : xqlConfig.key;
                    //TODO 待改成remote获取
                    var appForm = null;
                    //TODO 实现form的$$Data.query
                    if (xqlConfig.cmd == "form"||xqlConfig.cmd=="entity")
                        $scope[alias][bindTo] = appForm
                    else
                        $scope[alias][bindTo] = $$Data[xqlConfig.cmd].query(xqlConfig.params)
                    console.debug(">>>xqlConfig.cmd>>>",xqlConfig.cmd == "form"||xqlConfig.cmd=="entity")
                }
            }
        }
    }

    init();
    renderAll(cfgLoadFromRemote, $scope, $$Data)
}

var appForm = [
    {
        displayName: "应用名称",
        identifier: 'name',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "应用编码",
        identifier: 'code',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "链接",
        identifier: 'href',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "图标",
        identifier: 'icon',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "描述",
        identifier: 'description',
        type: {name: "textarea"}
    }
]

function views_tabs_simple($scope, $$Data) {

    function init(owner) {

    }

    function load() {

    }

    $scope.switch = function () {
        console.debug("views_list_simple.doAction")
    }

    return {
        init: init,
        load: load
    }
}

function views_layout_mixListPlus($scope, $$Data) {
    function init(owner) {

    }

    function load() {

    }
    return {
        init: init,
        load: load
    }
}

function views_detail_simple($scope, $$Data) {
    this.owner = {};

    function init(owner) {
        this.owner = owner;
        console.debug(">>>views_detail_simple>>>init(cfg)>>>", owner.cfg)
        //初始化表单验证
        $(document).ready(function () {
            $("#" + owner.cfg.alias + "Form").form(owner.cfg.form, {
                inline: false,
                on: 'blur'
            })
        });
        //获取下拉列表等基础数据
//        for(var i in activeView.template.data){
//            if(activeView.template.data[i].type_select){
//                var xqlConfig = xgeeUtils.xql.parse(activeView.template.data[i].type_select.xql);
//                activeView.template.data[i].type_select.dataRef = xqlConfig.key;
//                $$Data[xqlConfig.cmd].query(xqlConfig.params,function(data){
//                    $scope[xqlConfig.key] =data;
//                })
//            }
//        }
    }

    function load() {

    }

    self.save = function (cfg) {
        if ($("#" + cfg.alias + "Form").form('validate form')) {
            $scope.item = eval("moduleData." + __resName + ".save(xgeeUtils.convertName($scope." + cfg.alias + ".item), $scope.$parent.refresh)");
            $scope.$parent.currentItem = $scope.item;
        }
    }

    return {
        init: init,
        load: load
    }
}

function views_list_simple($scope, $$Data) {

}

function views_query_simple($scope, $$Data) {

}