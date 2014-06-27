var sysApp = angular.module('sysApp', ['ngGrid', 'ui.router', 'ngResource', 'xgeeUtils','xgee']);
//detailVies 设置了template说明采用了模板文件。其它情况是自定义的文件，在加载模板时，直接加载该文件返回。
//active：[true|false]需在detailViews中的一个设置该项，一个或多个页面时时，需且只需设置一个页面。
//list.actions.default 没有设置时，mixListPlus、mixList的模板中采用默认的操作，包括新增、删除。默认值为：[{add:false},{remove:true}]
//list.actions.actions 自定义的一些操作,打开detailViews中的view。
//actions:target:modal/self/inner,默认为inner
//                add: {name: '添加', target: 'inner', group: "tabs", view: 'detail', enable: true},
sysApp.provider('$$sysConfig', function ($$sysForms) {
    this.user = {
        moduleName: 'sys',
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
    this.role = {
        moduleName: 'sys',
        resName: 'role',
        view: {
            name: 'mixListPlus',
            url: 'tmpl/base/mixListPlus',
            title: '角色列表',
            query: {},
            list:{
                onRowClick:'update'
            },
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"name",displayName:'角色名称',width:"30%"},
                {name:"code",displayName:'角色编码'}
            ],
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {tabs: [
                {name: 'detail', title: '概况', active: true, template: {data:$$sysForms.roleForm,dir:'xgee'}},
                {name: 'permission', title: '角色权限'},
                {name: 'user', title: '用户分配'}
            ]}
        }
    }
    this.permission = {
        moduleName: 'sys',
        resName: 'permission',
        view: {
            name: 'mixListPlus',
            title: '权限列表',
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"name",displayName:'权限名称',width:"30%"},
                {name:"text",displayName:'权限描述符'}
            ],
            list:{
                onRowClick:'update'
            },
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {tabs: [
                {name: 'detail', title: '基础信息', active: true, template:{data:$$sysForms.permissionForm,dir:'xgee'}}
            ]}
        }
    }
    this.app = {
        moduleName: 'sys',
        resName: 'app',
        view: {
            name: 'mixListPlus',
            title: '应用列表',
            header: [
                {name:"id",displayName:'序号',width:"10%"},
                {name:"name",displayName:'名称',width:"30%"},
                {name:"code",displayName:'应用编码'}
            ],
            list:{
                onRowClick:'update'
            },
            actions: [
                {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
            ],
            containers: {tabs: [
                {name: 'detail', title: '应用信息', active: true, template: {data:$$sysForms.appForm,dir:'xgee'}},
                {name: 'subModule', title: '子模块信息'}
            ]}
        }
    }
    this.$get = function () {
        return this
    };
})


sysApp.config(function ($xgeeRouterProvider, $$sysConfigProvider) {
    try {
        $xgeeRouterProvider.setModuleState("sys");
        $xgeeRouterProvider.setResState($$sysConfigProvider.user);
        $xgeeRouterProvider.state('sys.user.profile', {
            url: "/profile",
            views: {
                sys_user: { templateUrl: "m/sys/user/profile.html" }
            },
            controller: 'sys_user_profile'
        })
        $xgeeRouterProvider.setResState($$sysConfigProvider.role);
        $xgeeRouterProvider.setResState($$sysConfigProvider.app);
        $xgeeRouterProvider.setResState($$sysConfigProvider.permission);
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
sysApp.constant('$$sysForms', {
    userForm: [
        {
            title: "名称",
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
            ],
            tips:'填写英文字符，例如:admin',
            required:true //系统会依据rules中是否有empty来设置该值， 这里可以不写
        },
        {
            title: "描述",
            identifier: 'description',
            textarea: true
        }
    ],
    permissionForm: [
        {
            title: "权限名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            title: "权限描述符",
            identifier: 'text',
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
    appForm: [
        {
            title: "应用名称",
            identifier: 'name',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },
        {
            title: "应用编码",
            identifier: 'code',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },{
            title: "链接",
            identifier: 'href',
            rules: [
                {type: 'empty', prompt: '不允许为空'}
            ]
        },{
            title: "图标",
            identifier: 'icon',
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


sysApp.factory('$$sysRes', ['$resource','$$Data',function ($Resource,$$Data) {
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略

        //-----------m.sys-----------//
        app: $Resource("/api/app/:id", {id: '@id'}, $$Data.action),
        user: $Resource("/api/user/:id", {id: '@id'}, $$Data.action),
        role: $Resource("/api/role/:id", {id: '@id'}, $$Data.action),
        permission: $Resource("/api/permission/:id", {id: '@id'}, $$Data.action),
        //增加符号$，表示非实体
        $auth: $Resource("/api/auth", {}, $$Data.action)
    }
}]);


