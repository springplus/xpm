var metadataApp = angular.module('metadataApp', ['ngGrid', 'ui.router', 'ngResource', 'xgeeUtils']);

//detailVies 设置了template说明采用了模板文件。其它情况是自定义的文件，在加载模板时，直接加载该文件返回。
//active：[true|false]需在detailViews中的一个设置该项，一个或多个页面时时，需且只需设置一个页面。
//list.actions.default 没有设置时，mixListPlus、mixList的模板中采用默认的操作，包括新增、删除。默认值为：[{add:false},{remove:true}]
//list.actions.actions 自定义的一些操作,打开detailViews中的view。
//actions:target:modal/self/inner,默认为inner
//                add: {name: '添加', target: 'inner', group: "tabs", view: 'detail', enable: true},

metadataApp.provider('$$metadataConfig', function ($$metadataForms) {
    this.logicEntity = {
        moduleName: 'metadata',
        resName: 'logicEntity',
        view: {
            name: 'mixListPlus',//定指该配置的解释器 //若是ngGrid，则可设置该值，类似若实现其它模板则相应的设置对象
            url: 'tmpl/base/mixListPlus',//若不填写的话，默认为 m/tmpl/{{moduleName}}/{{view.name}}
            title: '字典列表',
            query: [
                {displayName: '用户名称', name: 'name', type: 'text', rule: ['required']},
                {displayName: '登录名', name: 'login_name', type: 'text', rule: ['required']},
                {displayName: '状态', name: 'status', type: 'select', label: 'label', value: 'id', rule: ['required']}//默认select的数据来源于dict
            ],//可设置查询条件
            list:{
                onRowClick:'update'
            },
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"name",displayName:'字典项名称',width:"40%"},
                {name:"code",displayName:'字典项编码'}
            ],
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'steps', viewName: 'addLogicEntity', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'steps', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {
                tabs: [
                    {name: 'detail', title: '实体信息', active: true, template: {data:$$metadataForms.logicEntityForm,dir:'xgee'}},
                    {name: 'crudLogicField', title: '字段信息' }
                ], steps: [
                    {name: 'addLogicEntity', title: '选择物理实体', active: true},
                    {name: 'crudLogicField', title: '配置实体字段' }
                ], none: [], modal: []
            }
        }
    }
    this.dataItem = {
        moduleName: 'metadata',
        resName: 'dataItem',
        view: {
            name: 'mixListPlus',//定指该配置的解释器 //若是ngGrid，则可设置该值，类似若实现其它模板则相应的设置对象
            url: 'tmpl/base/mixListPlus',//若不填写的话，默认为 m/tmpl/{{moduleName}}/{{view.name}}
            title: '字典列表',
            query: [
                {displayName: '用户名称', name: 'name', type: 'text', rule: ['required']},
                {displayName: '登录名', name: 'login_name', type: 'text', rule: ['required']},
                {displayName: '状态', name: 'status', type: 'select', label: 'label', value: 'id', rule: ['required']}//默认select的数据来源于dict
            ],//可设置查询条件
            list:{
                onRowClick:'update'
            },
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"name",displayName:'字典项名称',width:"40%"},
                {name:"code",displayName:'字典项编码'}
            ],
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'steps', viewName: 'addLogicEntity', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {
                tabs: [], steps: [], none: [
                    {name: 'detail', title: '概况', active: true}
                ], modal: []
            }
        }
    }
    this.dataItemCatalog = {
        moduleName: 'metadata',
        resName: 'dataItemCatalog',
        view: {
            name: 'mixListPlus',//定指该配置的解释器 //若是ngGrid，则可设置该值，类似若实现其它模板则相应的设置对象
            url: 'tmpl/base/mixListPlus',//若不填写的话，默认为 m/tmpl/{{moduleName}}/{{view.name}}
            title: '字典分类',
            query: [
//                {displayName: '用户名称', name: 'name', type: 'text', rule: ['required']},
//                {displayName: '登录名', name: 'login_name', type: 'text', rule: ['required']},
//                {displayName: '状态', name: 'status', type: 'select', label: 'label', value: 'id', rule: ['required']}//默认select的数据来源于dict
            ],//可设置查询条件
            list:{
                onRowClick:'update'
            },
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"name",displayName:'字典分类'}
            ],
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'none', viewName: 'detail', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'none', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true},
                {name: 'retrieve', displayName: '查看', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {
                tabs: [], steps: [], none: [
                    {name: 'detail', title: '概况', active: true,template:{data:$$metadataForms.dataItemCatalogForm,dir:'xgee'}}
                ], modal: []
            }
        }
    }
    this.$get = function () {
        return this
    };
})


metadataApp.config(function ($xgeeRouterProvider, $$metadataConfigProvider) {
    $xgeeRouterProvider.setModuleState("metadata");
    $xgeeRouterProvider.setResState($$metadataConfigProvider.logicEntity);
    $xgeeRouterProvider.setResState($$metadataConfigProvider.dataItemCatalog);
    $xgeeRouterProvider.setResState($$metadataConfigProvider.dataItem);
})

//ngGridOptions: {
//    columnDefs: [
//        {field: 'id', displayName: '序号'},
//        {field: 'name', displayName: '字典项名称'},
//        {field: 'code', displayName: '字典项编码'}
//    ]
//},

/**
 * 该文件只保存form表单的信息，便于java、C#等服务端代码可以解析共用该验证配置信息
 * identifier、rules是SemanticUI验证框架需采用的字段
 * title自定义的字段，用于表单的名称展示
 * textarea自定义的字段，用于展示控制，判断是否控件类型
 */
metadataApp.constant('$$metadataForms', {
    logicEntityForm: [
        {
            title: "名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            title: "编码",
            identifier: 'code',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            title: "描述",
            identifier: 'description',
            textarea: true
        }
    ],
    dataItemCatalogForm: [
        {
            title: "名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            title: "描述",
            identifier: 'description',
            textarea: true
        }
    ]
})



metadataApp.factory('$$metadataRes', ['$resource','$$Data',function ($Resource,$$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略
        //-----------m.metadata-----------//
        $metadataRes: $Resource("/api/metadata/:res", {res: '@res'}, $$Data.action),
        logicEntity: $Resource("/api/logicEntity/:id", {id: '@id'}, $$Data.action),
        logicField: $Resource("/api/logicField/:id", {id: '@id'}, $$Data.action),
        $logicFieldBatch: $Resource("/api/metadata/batchSaveLogicField", {}, $$Data.batchSaveOnlyAction),
        factualEntity: $Resource("/api/factualEntity/:id", {id: '@id'}, $$Data.queryOnlyAction),
        dataItem: $Resource("/api/dataItem/:id", {id: '@id'}, $$Data.action),
        dataItemCatalog: $Resource("/api/dataItemCatalog/:id", {id: '@id'}, $$Data.action),
        dataItemEnum: $Resource("/api/dataItemEnum/:id", {id: '@id'}, $$Data.action),
        enumValue: $Resource("/api/enumValue/:id", {id: '@id'}, $$Data.action)
    }
}]);