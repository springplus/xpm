//;var views_design_edit = ViewBaseCtrl.extend(function (base) {
////    this.owner = $scope[alias];
////    this.$scope = $scope[alias];
////    this.$$Data = $scope[alias];
//    return {
//        init: function (args) {
//            console.debug(">>views_design_edit.init()")
//            console.debug("- args.$scope >",args.$scope);
//            console.debug("- args.$cfg >",base.$cfg);
//            args.$scope.xx = "xxxxxxxxxxx"
//        },
//        format: function (data) {
//
//        }
//
//
//    }
//});

;var views_design_edit = function($scope,$alias$,ViewCfgManager){
    var renderInfo = ViewCfgManager.renderDict[$alias$.params.selectTo]
    $alias$.editRenderInfo = renderInfo;

    $alias$.vo = {}
    $alias$.vo.type={
        action:{
            fields: [
                {name: "displayName", displayName: "名称", width: "20%"},
                {name: "type", displayName: "操作类型", width: "25%"},
                {name: "alias", displayName: "目标视图别名",width:"25%",type:'enum',value:['alias_4','alias_5']},
                {name: "params", displayName: "自定参数",width:"15%",type:'enum',value:[]}
            ]
        }
    }
    $alias$.vo.cfg = $scope[renderInfo.alias].cfg;

    $alias$.action = {}
    $alias$.action.add=function(actionsScope){
        if(!actionsScope.actions)actionsScope.actions = {}
        var action = {"displayName": "新操作","type":"openView","alias":"alias_x.detail","params":{}};
        actionsScope.actions.push(action)
        console.debug(">>after addAction,the actions is ",actionsScope.actions)
    }
    $alias$.action.up=function(actionsScope,index){
       if(index<=0)return;
       var upItem = actionsScope.actions.splice(index,1)
//       console.debug(">>upItem>",upItem)
       var insertIndex = index-1;
       actionsScope.actions.splice(insertIndex,0,upItem[0]);
//        actionsScope.actions.push(upItem)

    }
    $alias$.action.remove=function(actionsScope,index){
        actionsScope.actions.splice(index,1)
    }


    $alias$.data = $alias$.data||{}
    $alias$.data.add = function(dataScope){
        if(!dataScope.data)dataScope.data = {}
        var data = {"xql": "res:sys_find_test", "value": {}, "bindTo": "listData"}
        dataScope.data.push(data)
    }
    $alias$.data.remove=function(dataScope,index){
        dataScope.data.splice(index,1)
    }

    $alias$.list = $alias$.list||{}
    $alias$.list.add = function(scope){
        if(!scope.fields)scope.fields = {}
        var data = {"name": "xx", "displayName": "xx", "width": "10%"}
        scope.fields.push(data)
    }
    $alias$.list.remove=function(scope,index){
        scope.fields.splice(index,1)
    }



    console.debug("new views_design_edit,alias is ",renderInfo.alias)
}