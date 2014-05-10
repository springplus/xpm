/**
 * Created by hongxueqian on 14-3-31.
 */
function sys_role($state) {
//   $state.go('sys.role.mixList')
}

function sys_role_mixList($$stateProxy,$state, $scope, $$Data) {
    $scope.refresh = function(){
        //重新新加列表，更新被加到逻辑实体之后的结果
        $scope.ngxListData = $$Data.Role.query();
        $scope.ngxListHeader =appUtils.objectToArray({name:"角色名称",code:"角色编码"})
    }
    function clickItem(event,msg){
        $$stateProxy.goto('sys.role.mixList.detail',msg.item)
    }
    function doRemoveItem(event,msg){
        $$Data.Role.delete(msg.item,function(){
            appUtils.tipSuccess("成功删除！")
            $scope.refresh();
        });
    }
    $scope.addItem = function(){
        $state.go('sys.role.mixList.detail');
    }
    $scope.roleDirective = new appUtils.Directive($scope,"ngx_grid_role",{clickItem:clickItem,doRemoveItem:doRemoveItem})

    $scope.refresh();
}

function sys_role_mixList_detail($scope,$filter, $$Data,$stateParams,$state) {

    console.debug(">>>>",$stateParams)
    $scope.refresh = function(){
        $scope.item= $$Data.Role.get(appUtils.paramsToObject($stateParams.item))
    }
    $scope.refresh();




    $scope.saveItem = function(){
        $$Data.Role.save(appUtils.convertName($scope.item),$scope.$parent.refresh)
    }




}

function sys_role_profile($scope,$filter,$$Data,$stateParams){
    $scope.item = $$Data.Role.get({id:0});
    console.debug(">>>",$scope.item)
    $scope.item.create_date$ = $filter('date')($scope.item.create_date, 'yyyy-MM-dd');
}