var ws = angular.module('ws', ['ngGrid', 'ui.router', 'ngResource', 'xgeeUtils','xgee']);
ws.provider('$$wsConfig', function ($$wsForms) {
    this.user = {
        moduleName: 'ws',
        resName: 'user',
        view: {
            name: 'mixListPlus',//定指该配置的解释器 //若是ngGrid，则可设置该值，类似若实现其它模板则相应的设置对象
            url: 'tmpl/base/mixListPlus',//若不填写的话，默认为 m/tmpl/{{moduleName}}/{{view.name}}
            title: '用户列表',
            query:[
                {type_select:true,displayName:'所属单位',identifier:'name', rules: [{type: 'empty', prompt: '不允许为空'}]},
                {type_text:true,displayName:'用户名称',identifier:'name', rules: [{type: 'empty', prompt: '不允许为空'}]},
                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
//                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]},
                {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]}

            ],

//            query: [
//                {displayName:'用户名称',name:'name',type:'text',rule:['required']},
//                {displayName:'登录名',name:'login_name',type:'text',rule:['required']},
//                {displayName:'状态',name:'status',type:'select',label:'label',value:'id',rule:['required']}//默认select的数据来源于dict
//            ],//可设置查询条件
            list:{
                onRowClick:'update'
            },
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"name",displayName:'用户名称',width:"30%"},
                {name:"login_name",displayName:'登录账号'}
            ],
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {
                tabs: [
                    {name: 'detail', title: '概况', active: true},
                    {name: 'role', title: '角色授权' },
                    {name: 'app', title: '应用授权情况'}
                ], steps: [], none: [], modal: []
            }
        }
    }

    this.$get = function () {
        return this
    };
})


ws.config(function ($xgeeRouterProvider, $$wsConfigProvider) {
    try {
        $xgeeRouterProvider.setModuleState("ws");
        $xgeeRouterProvider.setResState($$wsConfigProvider.user);
        $xgeeRouterProvider.state('ws.user.profile', {
            url: "/profile",
            views: {
                ws_user: { templateUrl: "m/ws/user/profile.html" }
            },
            controller: 'ws_user_profile'
        })
        $xgeeRouterProvider.setResState($$wsConfigProvider.role);
        $xgeeRouterProvider.setResState($$wsConfigProvider.app);
        $xgeeRouterProvider.setResState($$wsConfigProvider.permission);
    } catch (e) {
        console.error(e.message, e.stack)
    }
})


/**
 * 该文件只保存form表单的信息，便于java、C#等服务端代码可以解析共用该验证配置信息
 * identifier、rules是SemanticUI验证框架需采用的字段
 * title自定义的字段，用于表单的名称展示
 * textarea自定义的字段，用于展示控制，判断是否控件类型
 */
ws.constant('$$wsForms', {
    userForm: [
        {
            displayName: "名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            name: "编码",
            identifier: 'code',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        }
    ],
    roleForm: [
        {
            displayName: "名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            displayName: "编码",
            identifier: 'code',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ],
            tips:'填写英文字符，例如:admin',
            required:true //系统会依据rules中是否有empty来设置该值， 这里可以不写
        },
        {
            displayName: "描述",
            identifier: 'description',
            type_textarea: true
        }
    ],
    permissionForm: [
        {
            displayName: "权限名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            displayName: "权限描述符",
            identifier: 'text',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
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
        },{
            displayName: "链接",
            identifier: 'href',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },{
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


ws.factory('$$wsRes', ['$resource','$$Data',function ($Resource,$$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略

        //-----------m.ws-----------//
        app: $Resource("/api/app/:id", {id: '@id'}, $$Data.action),
        user: $Resource("/api/user/:id", {id: '@id'}, $$Data.action),
        role: $Resource("/api/role/:id", {id: '@id'}, $$Data.action),
        permission: $Resource("/api/permission/:id", {id: '@id'}, $$Data.action),
        //增加符号$，表示非实体
        $auth: $Resource("/api/auth", {}, $$Data.action)
    }
}]);


