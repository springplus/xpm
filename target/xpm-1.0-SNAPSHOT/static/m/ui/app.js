var uiApp = angular.module('uiApp', ['ngGrid', 'ui.router', 'ngResource', 'xgeeUtils']);
uiApp.provider('$$uiConfig', function ($$uiForms) {
    this.design = {
        moduleName: 'ui',
        resName: 'design',
        view: {
            name: 'mixListPlus',
            title: '查询配置列表',
            query: [
                {type_select: true, displayName: '所属单位', identifier: 'name', rules: [
                    {type: 'empty', prompt: '不允许为空'}
                ]},
                {type_text: true, displayName: '用户名称', identifier: 'name', rules: [
                    {type: 'empty', prompt: '不允许为空'}
                ]},
                {type_date: true, displayName: '注册日期', identifier: 'createDate', rules: [
                    {type: 'empty', prompt: '不允许为空'}
                ]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
                {type_date: true, displayName: '注册日期', identifier: 'createDate', rules: [
                    {type: 'empty', prompt: '不允许为空'}
                ]}

            ],
            list: {
                fields: [
                    {name: "id", displayName: '序号', width: "10%"},
                    {name: "sqlKey", displayName: '查询键', width: "50%"},
                    {name: "name", displayName: '列表名称'}
                ],
                onRowClick: 'update'
            },
            header: [
                {name: "id", displayName: '序号', width: "10%"},
                {name: "sqlKey", displayName: '查询键', width: "50%"},
                {name: "name", displayName: '列表名称'}
            ],
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {
                tabs: [
                    {name: 'detail', title: '配置', active: true, template: {data: $$uiForms.sqlConfigForm, dir: 'xgee'}},
                    {name: 'parameter', title: '参数配置' },
                    {name: 'test', title: '配置结果测试' }
                ], steps: [], none: [], modal: []
            }
        }
    }

    this.$get = function () {
        return this
    };
})

uiApp.constant('$$uiForms', {
    sqlConfigForm: [
        {
            displayName: "查询键",
            identifier: 'sqlKey',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            displayName: "名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            displayName: "所属应用",
            identifier: 'appId',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ],
            type_select: {xql: 'res:sys_find_appDict', label: 'name', value: 'id'}
        },
        {
            displayName: "语句内容",
            identifier: 'content',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ],
            type_textarea: true
        },
        {
            displayName: "描述",
            identifier: 'description',
            type_textarea: true
        }
    ],
    appForm: [
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
            type_textarea: true
        }
    ]
})


uiApp.config(function ($xgeeRouterProvider, $$uiConfigProvider) {
    $xgeeRouterProvider.state("ui_design_index", {
        url: "/ui_design_index",
        views:{'index':{templateUrl: "m/ui/design/index.mustache?alias=baseView"}}
//        ,
//        data: {name:"views_layout_mixListPlus",alias: "sys_app"}
    }).state("ui_design_main", {
        url: "/ui_design_main",
        views:{'index':{templateUrl: "m/ui/design/index.mustache?alias=ui_design_main"}}
    })


//    $xgeeRouterProvider.setModuleState("ui");
//    $xgeeRouterProvider.state("ui.design_mixListPlus",
//        { url: "/design_mixListPlus",
//            views: {
//                "ui": {templateUrl: "m/ui/design/mixListPlus.html"}
//            }
//        }
//    )

//        .state("ui.design_mixListPlus",
//        { url: "/design_mixListPlus",
//            views: {
//                "northView": {templateUrl: "m/ui/design/views_query_simple.html"},
//                "westView": {templateUrl: "m/ui/design/views_list_simple.html"},
//                "eastView": {templateUrl: "m/ui/design/views_detail_simple.html"}
//            }
//        }
//    )

//

//    $xgeeRouterProvider.setState("ui.info");
//    $xgeeRouterProvider.setState("ui.info.index");
})

uiApp.factory('$$uiRes', ['$resource', '$$Data', function ($Resource, $$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略
        //-----------m.ui-----------//
        sqlConfig: $Resource("/api/rpt/sqlConfig/:id", {id: '@id'}, $$Data.action)
    }
}]);