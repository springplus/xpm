/**
 * 该文件只保存form表单的信息，便于java、C#等服务端代码可以解析共用该验证配置信息
 * identifier、rules是SemanticUI验证框架需采用的字段
 * title自定义的字段，用于表单的名称展示
 * textarea自定义的字段，用于展示控制，判断是否控件类型
 */
metadata.constant('$$metadataForms', {
    logicEntityForm: [
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
    ]
})

