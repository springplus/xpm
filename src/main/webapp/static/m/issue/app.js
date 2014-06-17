var issue = angular.module('issue', ['ngGrid', 'ui.router', 'ngResource', 'xgeeUtils']);

issue.provider('$$issueConfig', function ($$issueForms) {
    this.issue = {
        moduleName: 'issue',
        resName: 'issue',
        view: {
            name: 'mixListPlus',//定指该配置的解释器 //若是ngGrid，则可设置该值，类似若实现其它模板则相应的设置对象
            url: 'tmpl/base/mixListPlus',//若不填写的话，默认为 m/tmpl/{{moduleName}}/{{view.name}}
            title: '缺陷列表',
            query: [
                {displayName: '用户名称', name: 'name', type: 'text', rule: ['required']},
                {displayName: '登录名', name: 'login_name', type: 'text', rule: ['required']},
                {displayName: '状态', name: 'status', type: 'select', label: 'label', value: 'id', rule: ['required']}//默认select的数据来源于dict
            ],//可设置查询条件
            list:{
                rowClickAction:'update'
            },
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"issueTitle",displayName:'缺陷',width:"40%"}
            ],
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {
                tabs: [
                    {name: 'detail', title: '概况', active: true},
                    {name: 'comment', title: '评论信息' }
                ], steps: [], none: [], modal: []
            }
        }
    }
    this.$get = function () {
        return this
    };
})


issue.config(function ($xgeeRouterProvider, $$issueConfigProvider) {
    $xgeeRouterProvider.setModuleState("issue");
    $xgeeRouterProvider.setResState($$issueConfigProvider.issue);
})

issue.constant('$$issueForms', {
    logicEntityForm: [
        {
            title: "名称",
            identifier: 'title',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            title: "类型",
            identifier: 'type',
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



issue.factory('$$issueRes', ['$resource','$$Data',function ($Resource,$$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略
        //-----------m.issue-----------//
        issue: $Resource("/api/issue/:res", {res: '@res'}, $$Data.action)
    }
}]);