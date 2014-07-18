;
var resViewConfig = {};
resViewConfig["baseView"] = {name: "views_layout_mixListPlus", alias: "sys_app", dir: "", renderTo: "rootIndex",
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

resViewConfig["ui_design_main"] = {name: "views_design_main", alias: "ui_design_main", dir: "", renderTo: "rootIndex"

}

//    console.debug(">>>$$stateProxy.state.current.data>>>", $state.current.data)
var cfgLoadFromRemote = {name: "views_layout_mixListPlus", alias: "sys_app", dir: "", renderTo: "rootIndex",
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
var baseTmplInstance = {name: "views_design", alias: "views_design", dir: "", renderTo: "rootIndex",
    views:[
        {name:"views_layout_mixListPlus"}
    ]
}



var viewCfg = {name: "views_layout_mixListPlus", alias: "sys_app", dir: "", renderTo: "index",
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


//        $scope.layoutNorthMinHeight = 100
//        var layoutWestHeight = $(window).height() - $("#header").height() - $("#layoutNorth").height()
//        $scope.layoutWestHeight = layoutWestHeight;
//



/**
 *
 * @param dir
 * @param name
 * @param alias
 * @param isConfigurable 是否启用配置功能，启用的话在加载的配置信息加需更有配置页面的信息
 */
var loadFromRemote = function (dir, name, alias, isConfigurable) {

}
