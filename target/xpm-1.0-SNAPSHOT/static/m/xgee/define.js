//配置文件定义文件

xgee.define = {};
xgee.define.fieldTypeDefine = {
    type_select: [
        {name: 'displayName', type: "string", displayName: '字段名称', tips: '', rule: '*'},
        {name: 'identifier', type: "string", displayName: '字段编码', tips: '', rule: '*'}
    ],
    type_text: [
        {name: 'displayName', type: "string", displayName: '字段名称', tips: '', rule: '*'},
        {name: 'identifier', type: "string", displayName: '字段编码', tips: '', rule: '*'}
    ],
    type_date: [
        {name: 'displayName', type: "string", displayName: '字段名称', tips: '', rule: '*'},
        {name: 'identifier', type: "string", displayName: '字段编码', tips: '', rule: '*'}
    ]
}


this.sqlConfig = {
    moduleName: 'report',
    resName: 'sqlConfig',
    view: {
        name: 'mixListPlus',
        title: '查询配置列表',
        template: {dir: "xgee"}, //有该值表示需从模板目录中获取
        controller: "rpt_sqlConfig_mixListPlus",
        components: {
            query: { //query:组件类名称
                xql: "cfg:rpt_find_user" //命令：cfg，表示获取配置信息，rpt_find_user相当于数据表rpt_sql_config字段sql_key的值
//                  ,
//                filters: {},
//                parameters: {},
//                list: {
//                    fields: [
//                        {name: "id", displayName: '序号', width: "10%"},
//                        {name: "sqlKey", displayName: '查询键', width: "50%"},
//                        {name: "name", displayName: '列表名称'}
//                    ],
//                    events: [
//                        {onRowClick: 'update'}
//                    ]
//                },
//                actions: [
//                    {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
//                    {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
//                    {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
//                ]
            }
        },

        views: [
            {
                name: 'detail',
                title: '查询配置列表',
                template: {dir: "xgee"}, //有该值表示需从模板目录中获取
                controller: "rpt_sqlConfig_mixListPlus_detail",
                components: {
                    form: {
                        xql: "cfg:rpt_find_user",
                        actions: [
                            {name: 'create', displayName: '添加', targetContainer: 'tabs', viewName: 'detail', enable: true},
                            {name: 'update', displayName: '修改', targetContainer: 'tabs', viewName: 'detail', enable: true},
                            {name: 'delete', displayName: '删除', targetContainer: 'none', viewName: 'detail', enable: true}
                        ]
                    }
                }

            }
        ],
        containers: {
            tabs: [
                {name: 'detail', title: '配置', active: true, refView: 'detail'},
                {name: 'parameter', title: '参数配置' },
                {name: 'test', title: '配置结果测试' }
            ], steps: [], none: [], modal: []
        }
    }
}
