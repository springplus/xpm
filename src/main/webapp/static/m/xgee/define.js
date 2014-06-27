//配置文件定义文件

var query = [
    //select  label==displayName,identifier==name
    {type_select:true,displayName:'所属单位',identifier:'org', rules: [{type: 'empty', prompt: '不允许为空'}]},
    //text
    {type_text:true,displayName:'用户名称',identifier:'name', rules: [{type: 'empty', prompt: '不允许为空'}]},
    //date
    {type_date:true,displayName:'注册日期',identifier:'createDate', rules: [{type: 'empty', prompt: '不允许为空'}]}

]

