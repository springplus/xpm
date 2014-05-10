/**
 * Created by hongxueqian on 14-3-31.
 */

var roleConfig = {moduleName: 'sys', entityName: 'Role',list:{title:'角色列表', header: {id:'序号',name: '角色名称', code: '角色编码'}}};

function sys_role($state) {

}

function sys_role_mixList($scope, $$Data,$$stateProxy) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,  roleConfig)
}

function sys_role_mixList_detail($scope, $$Data, $stateParams, $state) {
    return tmpl_ctrl_module_entity__mixList_detail($scope,$$Data,$stateParams,roleConfig)
}

//function sys_role_mixList($$stateProxy,$scope, $$Data) {
//    $scope.refresh = function () {
//        $scope.listData = $$Data.Role.query();
//        $scope.listHeader = {name: "角色名称", code: "角色编码"}
//    }
//
//
//    $scope.addItem = function () {
//        $$stateProxy.goto('sys.role.mixList.detail');
//    }
//    $scope.roleDirective = new appUtils.Directive($scope, "ngx_list_role", {clickItem: clickItem, doRemoveItem: doRemoveItem})
//    $scope.removeItem = function(){
//        $scope.roleDirective.removeItem();
//    }
//    function doRemoveItem(event, msg) {
//        $$Data.Role.delete(msg.item, $scope.refresh);
//        $scope.addItem();
//    }
//    function clickItem(event, msg) {
//        $$stateProxy.goto('sys.role.mixList.detail', msg.item)
//    }
//    $scope.refresh();
//}



//function sys_role_mixList_detail($scope, $filter, $$Data, $stateParams, $state) {
//
//    console.debug(">>>>", $stateParams)
//    $scope.refresh = function () {
//        if ($stateParams && $stateParams.item)
//            $scope.item = $$Data.Role.get(appUtils.paramsToObject($stateParams.item))
//    }
//    $scope.refresh();
//
//    $scope.saveItem = function () {
//        if ($("#roleForm").form('validate form')) {
//            console.debug(">>>save>>>")
//            $scope.item = $$Data.Role.save(appUtils.convertName($scope.item), $scope.$parent.refresh)
//        }
//    }
//}
