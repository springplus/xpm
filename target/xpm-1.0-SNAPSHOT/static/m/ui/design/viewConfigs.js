
/**
 *
 * @param cfg
 * @param forceRenderTo
 * @param onSrcChanged
 * @returns {string} alias 空表示根|其它具体的视图别名
 */
//    function includeViewByRenderTo(cfg, onSrcChanged) {
////        if (forceRenderTo)console.debug(">>forceRenderTo>" + forceRenderTo + "\r\n  cfg>", cfg)
////        var renderTo = forceRenderTo || cfg.renderTo;
//        var renderTo = cfg.renderTo;
//        var dotIndex = renderTo.indexOf(".");
//        var renderToAlias = ""
//        var subName = "";
//        if (dotIndex == 0) {
//            //格式：".xxx"，表示加载到parent的视图中
//            renderToAlias = $scope[cfg.alias].parentAlias;
//            subName = renderTo.substring(1)
//        } else if (dotIndex > 0) {
//            //格式：“alias.xxx”，表示加载到指定的视图中
//            var rto = renderTo.split(".");
//            renderToAlias = rto[0];
//            subName = rto.length == 2 ? rto[1] : (rto.length == 3 ? rto[2] : console.error(">>>renderTo格式有误,应为xx | .xx | $alias$.xx | $alias$.include.xx>>", renderTo));
//
//        } else {
//            //格式："xxx"，表示加载到parent的视图中
//            renderToAlias = $scope[cfg.alias].parentAlias;
//            subName = renderTo;
//        }
//        //renderToAlias is false,that means, it's root cfg
//        var newUrl = ViewCfgHelper.genUrl(cfg);
//        if (renderToAlias) {
//            //TODO 怎么检查 renderTo的值和ng-include src中的值是否一致，不一致则throw error
////            if (!$scope[alias].include.hasOwnProperty(subName)) {
////                console.error("- ["+renderToAlias + ".include." + subName + "]不存在,请检查ng-include的src属性！");
////            }
////            if (forceRenderTo) {
////                console.debug("- $scope[renderToAlias]>>", $scope[renderToAlias])
////                angular.forEach($scope[renderToAlias], function (value, name) {
////                    console.debug("- " + name + " >", value);
////                })
////            }
//            if (angular.isFunction(onSrcChanged)) {
//                onSrcChanged($scope[renderToAlias].include[subName], newUrl)
//            }
//            $scope[renderToAlias].include[subName] = newUrl;
//        } else {
////            console.debug("$scope[subName]>>",$scope.hasOwnProperty(subName))
//            if (angular.isFunction(onSrcChanged)) {
//                onSrcChanged($scope[subName], newUrl)
//            }
//            $scope[subName] = newUrl;
//            console.debug("- $scope[" + subName + "]=", newUrl)
////            console.debug(">>>include[" + subName + "]=" + ViewCfgHelper.genUrl(cfg));
//        }
//        return renderToAlias || subName;
//    }


/**
 * 前提：目标cfg已加载、解析
 * 依据配置更换include src的值，实现页面的切换
 * @param srcAliasStr
 * @param targetAliasesStr alias,alias,alias... 可同时打开多个目标view
 */
//$scope.openViewX = function (srcAlias, targetAliasesStr, params) {
//    //active
//    //disable
//    //
//    //如果viewConfig不存在，则从远程加载；若远程也不存在则报错。
//
//    console.debug(">>>srcAlias:" + srcAlias + ">>>targetAliasesStr:" + targetAliasesStr + ">>>params", params)
//    var targetAliases = targetAliasesStr.split(",")
//    for (var i in targetAliases) {
//        var targetAlias = targetAliases[i];
//        //如果target有无点号，则取当前srcAlias下的view,否则按点号按层进行解析
//        var namespaces = targetAlias.split(".");
//        if (namespaces.length <= 2) {
//            var parentAlias = srcAlias;
//            var targetAlias = namespaces[0];
//            if (namespaces.length == 2) {
//                parentAlias = namespaces[0];
//                targetAlias = namespaces[1];
//            }
//        } else {
//            console.error("target:" + targetAliasesStr + "格式不正确，应为alias,alias,alias...每个alias的格式为：parentAlias.alias或alias。")
//        }
//        //通过别名，查找找到需打开的（目标）viewCfg
//        var targetCfg = ViewCfgHelper.findCfgByAlias(targetAlias, $scope[parentAlias].cfg);
//        //TODO 传入参数
//        openViewByCfg(targetCfg)
//    }
//}

;
//var resViewConfig = {};
//resViewConfig["baseView"] = {name: "views_layout_mixListPlus", alias: "sys_app", dir: "", renderTo: "rootIndex",
//    views: [
//        {name: "views_list_simple", alias: "sys_app_list", dir: "", renderTo: "westView",
//            title: '应用列表',
//            fields: [
//                {name: "id", displayName: '序号', width: "10%"},
//                {name: "name", displayName: '名称', width: "30%"},
//                {name: "code", displayName: '应用编码'}
//            ],
//            actions: [
//                {name: 'create', displayName: '添加', target: 'sys_app_tabs.sys_app_config'},
//                {name: 'delete', displayName: '删除', target: 'none'}
//            ],
//            list: {
//                click: {name: 'read', displayName: '查看/编辑', target: 'sys_app_tabs.sys_app_config'}
//            },
//            data: [
//                {xql: 'res:sys_find_appDict', value: {}, bindTo: "listData"}
//            ]
//        },
//        {name: "views_tabs_simple", alias: "sys_app_tabs", dir: "", renderTo: "eastView",
//            tabs: [
//                {name: 'detail', displayName: '配置', target: 'sys_app_config'},
//                {name: 'parameter', displayName: '参数配置', target: 'sys_app_parameter'},
//                {name: 'test', displayName: '配置结果测试', target: 'sys_app_test'}
//            ],
//            views: [
//                {name: "views_detail_simple", alias: "sys_app_config", dir: "", renderTo: "tabView",
//                    actions: [
//                        {name: 'save', displayName: '保存', data: [
//                            {xql: 'entity:sys.app', bindFrom: "item"}
//                        ]}
//                    ],
//                    form: appForm,
//                    data: [
//                        {xql: 'form:sys_app_form', value: {}, bindTo: "formData"}
//                    ]
//                },
//                {name: "views_detail_simple2", alias: "sys_app_parameter", dir: "", renderTo: "tabView", type: "html"},
//                {name: "views_detail_simple3", alias: "sys_app_test", dir: "", renderTo: "tabView", type: "html"}
//            ]
//        },
//        {name: "views_design_north", alias: "views_design_north", dir: "", renderTo: "northView"}
//    ]
//}

//resViewConfig["ui_design_main"] = {name: "views_design_main", alias: "ui_design_main", dir: "", renderTo: "rootIndex"
//
//}

//    console.debug(">>>$$stateProxy.state.current.data>>>", $state.current.data)


//var viewCfg = {name: "views_layout_mixListPlus", alias: "sys_app", dir: "", renderTo: "index",
//    views: [
//        {name: "views_list_simple", alias: "sys_app_list", dir: "", renderTo: "westView",
//            title: '应用列表',
//            fields: [
//                {name: "id", displayName: '序号', width: "10%"},
//                {name: "name", displayName: '名称', width: "30%"},
//                {name: "code", displayName: '应用编码'}
//            ],
//            actions: [
//                {name: 'create', displayName: '添加', target: 'sys_app_tabs.sys_app_config'},
//                {name: 'delete', displayName: '删除', target: 'none'}
//            ],
//            list: {
//                click: {name: 'read', displayName: '查看/编辑', target: 'sys_app_tabs.sys_app_config'}
//            },
//            data: [
//                {xql: 'res:sys_find_appDict', value: {}, bindTo: "listData"}
//            ]
//        },
//        {name: "views_tabs_simple", alias: "sys_app_tabs", dir: "", renderTo: "eastView",
//            tabs: [
//                {name: 'detail', displayName: '配置', target: 'sys_app_config'},
//                {name: 'parameter', displayName: '参数配置', target: 'sys_app_parameter'},
//                {name: 'test', displayName: '配置结果测试', target: 'sys_app_test'}
//            ],
//            views: [
//                {name: "views_detail_simple", alias: "sys_app_config", dir: "", renderTo: "tabView",
//                    actions: [
//                        {name: 'save', displayName: '保存', data: [
//                            {xql: 'entity:sys.app', bindFrom: "item"}
//                        ]}
//                    ],
//                    form: appForm,
//                    data: [
//                        {xql: 'form:sys_app_form', value: {}, bindTo: "formData"}
//                    ]
//                },
//                {name: "views_detail_simple2", alias: "sys_app_parameter", dir: "", renderTo: "tabView", type: "html"},
//                {name: "views_detail_simple3", alias: "sys_app_test", dir: "", renderTo: "tabView", type: "html"}
//            ]
//        },
//        {name: "views_design_north", alias: "views_design_north", dir: "", renderTo: "northView"}
//    ]
//}


var resViewConfigDemoData = {}
resViewConfigDemoData["views_design_main"] = {
    data:{

    }
}


//        $scope.layoutNorthMinHeight = 100
//        var layoutWestHeight = $(window).height() - $("#header").height() - $("#layoutNorth").height()
//        $scope.layoutWestHeight = layoutWestHeight;
//


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
