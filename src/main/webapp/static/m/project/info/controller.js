/**
 * Created by hongxueqian on 14-6-27.
 */

function project_info() {

}

function project_info_main($scope, $$projectRes, $$stateProxy,$$projectConfig) {
    var refresh = function(){
        $scope.ngxListData = $$projectRes.project.query();
        $scope.ngxListField =xgeeUtils.objectToArray({name:"项目名称"})
    }

    $scope.onEnterProjectInfo = function(){

    }

    function clickItem(event,msg){
        $$stateProxy.goto('project.info.index',{item:xgeeUtils.objectToParams(msg.item)})
    }

    $scope.projectDirective = new xgeeUtils.Directive($scope,"ngxListProject",{clickItem:clickItem})

    refresh();
}
