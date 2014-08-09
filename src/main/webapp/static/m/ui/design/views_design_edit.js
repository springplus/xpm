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

;var views_design_edit = function($scope,$$alias,ViewCfgManager){
    var renderInfo = ViewCfgManager.renderDict[$$alias.params.selectTo]
    $$alias.editRenderInfo = renderInfo;

    $$alias.vo = {}
    $$alias.vo.type={
        action:{
            fields: [
                {name: "displayName", displayName: "名称", width: "25%"},
                {name: "type", displayName: "操作类型", width: "25%"},
                {name: "alias", displayName: "目标视图别名",width:"25%"},
                {name: "params", displayName: "自定参数",width:"25%"}
            ]
        }
    }

    $$alias.vo.cfg = $scope[renderInfo.alias].cfg;

    console.debug("new views_design_edit,alias is ",renderInfo.alias)
}