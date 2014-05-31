/**
 * Created by hongxueqian on 14-3-3.
 */
function project($state) {
    $state.go('project.main')
}
function project_main($state, $scope, $http, $filter, $$MD) {
    $scope.to = function (name) {
        $scope.btnActive = name;
        $state.go('project.main.' + name)
    }
}

function project_main_mixList($state, $scope, $$Data,$stateParams) {
    var refresh = function(){
        $scope.ngxListData = $$Data.project.query();
        $scope.ngxListField =appUtils.objectToArray({name:"项目名称"})

    }

    function clickItem(event,msg){
        $state.go('project.main.mixList.detail',{item:appUtils.objectToParams(msg.item)},{location:false})
    }
    function doRemoveItem(event,msg){
        $$Data.project.delete(msg.item,refresh);
    }
    $scope.projectDirective = new appUtils.Directive($scope,"ngxListProject",{clickItem:clickItem,doRemoveItem:doRemoveItem})

    refresh();
}

function project_main_mixList_detail($scope, $$Data,$stateParams) {
    var params = appUtils.paramsToObject($stateParams.item);
    $scope.entity=params;
    var refresh = function(){
//        $scope.ngxListDataFields = $$Data.logicField.query({logic_entity_id:params.id});
//        $scope.ngxListFieldFields =appUtils.objectToArray({name:"字段名称",code:"字段编码"})
    }
    refresh();



}


function project_main_list($scope, $http) {

}



