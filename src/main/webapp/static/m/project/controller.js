/**
 * Created by hongxueqian on 14-3-3.
 */
function project($state) {
    $state.go('project.main')
}
function project_main($state, $scope, $http, $filter) {
    $scope.to = function (name) {
        $scope.btnActive = name;
        $state.go('project.main.' + name)
    }
}

function project_main_mixList($state, $scope, $$projectRes,$stateParams) {
    var refresh = function(){
        $scope.ngxListData = $$projectRes.project.query();
        $scope.ngxListField =xgeeUtils.objectToArray({name:"项目名称"})

    }

    function clickItem(event,msg){
        $state.go('project.main.mixList.detail',{item:xgeeUtils.objectToParams(msg.item)},{location:false})
    }
    function doRemoveItem(event,msg){
        $$projectRes.project.delete(msg.item,refresh);
    }
    $scope.projectDirective = new xgeeUtils.Directive($scope,"ngxListProject",{clickItem:clickItem,doRemoveItem:doRemoveItem})

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


function project_main_list($scope, $http) {

}


