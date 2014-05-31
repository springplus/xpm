var metadata = angular.module('metadata', ['ui.router', 'ngResource', 'appUtils']);

//detailVies 设置了templateData说明采用了模板文件。其它情况是自定义的文件，在加载模板时，直接加载该文件返回。
//active：[true|false]需在detailViews中的一个设置该项，一个或多个页面时时，需且只需设置一个页面。
//list.actions.default 没有设置时，mixListPlus、mixList的模板中采用默认的操作，包括新增、删除。默认值为：[{add:false},{remove:true}]
//list.actions.actions 自定义的一些操作,打开detailViews中的view。
//actions:target:modal/self/inner,默认为inner
metadata.provider('$$metadataConfig', function ($$metadataForms) {

    this.logicEntity = {
        moduleName: 'metadata',
        entityName: 'logicEntity',
        list: {
            view: 'mixListPlus',
            title: '字典列表',
            header: {id: '序号', name: '字典项名称', code: '字典项编码'},
            actions: {
                custom: [
                    {actionName: '新增', target: 'inner', view: 'tabs.detail'}
                ],
                default: [
                    {add: false},
                    {remove: true}
                ]
            }
        },
        detailViews: {
            tabs: [
                {title: '概况', parentView: 'mixListPlus', fileName: 'detail', active: true, templateData: $$metadataForms.logicEntityForm},
                {title: '字段', parentView: 'mixListPlus', fileName: 'dataItem'}

            ],
//            steps: [],
            none: [
                {title: '添加实休', parentView: 'mixListPlus', fileName: 'addLogicEntity'}
            ]
        }
    }
    this.dataItem = {
        moduleName: 'metadata',
        entityName: 'dataItem',
        list: {
            title: '字典列表',
            header: {id: '序号', name: '字典项名称', code: '字典项编码'},
            view: 'mixList'
        },
        detailViews: [
            {title: '概况', parentView: 'mixList', fileName: 'detail', active: true}
        ]
    }


    this.$get = function () {
        return this
    };
})


metadata.config(function ($$appStateProvider, $$metadataConfigProvider) {
//    $$appStateProvider.setModuleState("metadata");
//    $$appStateProvider.setEntityCrudState($$metadataConfigProvider.logicEntity);
//    $$appStateProvider.setEntityCrudState($$metadataConfigProvider.dataItem);

})

