var reportApp = angular.module('reportApp', ['ngGrid', 'ui.router', 'ngResource', 'xgeeUtils']);
reportApp.provider('$$reportConfig', function ($$reportForms) {
    this.sqlConfig = {
        moduleName: 'report',
        resName: 'sqlConfig',
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
                    {name: 'detail', title: '配置', active: true, template: {data: $$reportForms.sqlConfigForm, dir: 'xgee'}},
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

reportApp.constant('$$reportForms', {
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
            type_select: {xql:'res:sys_find_appDict',label:'name',value:'id'}
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
    ]
})


reportApp.config(function ($xgeeRouterProvider, $$reportConfigProvider) {
    $xgeeRouterProvider.setModuleState("report");
    $xgeeRouterProvider.setResState($$reportConfigProvider.sqlConfig)
//    $xgeeRouterProvider.setState("report.info");
//    $xgeeRouterProvider.setState("report.info.index");
})

reportApp.factory('$$reportRes', ['$resource', '$$Data', function ($Resource, $$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略
        //-----------m.report-----------//
        sqlConfig: $Resource("/api/rpt/sqlConfig/:id", {id: '@id'}, $$Data.action)
    }
}]);