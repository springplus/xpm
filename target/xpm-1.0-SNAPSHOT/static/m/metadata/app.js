var metadata = angular.module('metadata', ['ngGrid','ui.router', 'ngResource', 'appUtils']);

//detailVies 设置了templateData说明采用了模板文件。其它情况是自定义的文件，在加载模板时，直接加载该文件返回。
//active：[true|false]需在detailViews中的一个设置该项，一个或多个页面时时，需且只需设置一个页面。
//list.actions.default 没有设置时，mixListPlus、mixList的模板中采用默认的操作，包括新增、删除。默认值为：[{add:false},{remove:true}]
//list.actions.actions 自定义的一些操作,打开detailViews中的view。
//actions:target:modal/self/inner,默认为inner
//                add: {name: '添加', target: 'inner', group: "tabs", view: 'detail', enable: true},

metadata.provider('$$metadataConfig', function ($$metadataForms) {

    this.logicEntity = {
         moduleName: 'metadata',
        entityName: 'logicEntity',
        ngGridOptions:{
          //若未设置，则采用默认值
            columnDefs: [
                {field: 'id', displayName: '序号'},
                {field: 'name', displayName: '字典项名称'},
                {field: 'code', displayName: '字典项编码'}
            ]
        },
        list: {
            view: 'mixListPlus',
            title: '字典列表',
            header: {id: '序号', name: '字典项名称', code: '字典项编码'},
            query:{

            },
            actions: {
                custom: [
                    {name: '新增', target: 'inner', group:"steps",view: 'addLogicEntity'}
                ],
                default: {
                    add: {enable: false}
                }
            }
        },
        detailViews: {
            tabs: [
                {title: '实体信息', parentView: 'mixListPlus', fileName: 'detail', active: true, templateData: $$metadataForms.logicEntityForm},
                {title: '字段信息', parentView: 'mixListPlus', fileName: 'crudLogicField'}

            ],
            steps: [
                {title: '选择物理实体', parentView: 'mixListPlus', fileName: 'addLogicEntity'},
                {title: '配置实体字段', parentView: 'mixListPlus', fileName: 'crudLogicField'}
            ],
            none: [

            ]
        }
    }
//    this.dataItem = {
//        moduleName: 'metadata',
//        entityName: 'dataItem',
//        list: {
//            title: '字典列表',
//            header: {id: '序号', name: '字典项名称', code: '字典项编码'},
//            view: 'mixList'
//        },
//        detailViews: [
//            {title: '概况', parentView: 'mixList', fileName: 'detail', active: true}
//        ]
//    }


    this.$get = function () {
        return this
    };
})


metadata.config(function ($$appStateProvider, $$metadataConfigProvider) {
    $$appStateProvider.setModuleState("metadata");
    $$appStateProvider.setEntityCrudState($$metadataConfigProvider.logicEntity);
//    $$appStateProvider.setEntityCrudState($$metadataConfigProvider.dataItem);

})

