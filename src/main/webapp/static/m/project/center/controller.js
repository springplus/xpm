/**
 * Created by hongxueqian on 14-6-27.
 */

function project_center() {

}

function project_center_index($scope, $$projectRes, $$stateProxy,$$projectConfig) {
    var refresh = function(){
        $scope.ngxListData = $$projectRes.project.query();
        $scope.ngxListField =xgeeUtils.objectToArray({name:"项目名称"})

    }

    $scope.onEnterProjectView = function(){

    }

    function clickItem(event,msg){
        $$stateProxy.goto('project.info.index',{item:xgeeUtils.objectToParams(msg.item)})
    }

    $scope.projectDirective = new xgeeUtils.Directive($scope,"ngxListProject",{clickItem:clickItem})

    refresh();
}


function project_main_mixList_detail($scope, $$projectRes,$stateParams) {
    var params = xgeeUtils.paramsToObject($stateParams.item);
    $scope.entity=params;
    var refresh = function(){
//        $scope.ngxListDataFields = $$projectRes.logicField.query({logic_entity_id:params.id});
//        $scope.ngxListFieldFields =xgeeUtils.objectToArray({name:"字段名称",code:"字段编码"})
    }
    refresh();
}



