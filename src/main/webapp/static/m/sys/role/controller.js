/**
 * Created by hongxueqian on 14-3-31.
 */


function sys_role($state) {

}

function sys_role_mixListPlus($scope, $$sysRes, $$stateProxy,$$sysConfig) {
    return mixListPlusCtrlTmpl($scope, $$sysRes, $$stateProxy, $$sysConfig.role);
}

function sys_role_mixListPlus_tabs_detail($scope, $$sysRes, $stateParams, $$sysConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope, $$sysRes, $stateParams, $$sysConfig.role)
}


function sys_role_mixListPlus_tabs_user($scope, $$sysRes, $stateParams, $$sysConfig) {



    $scope.refresh = function () {
        console.debug("$stateParams", $stateParams);
        if ($stateParams && $stateParams.item) {
            $scope.item = xgeeUtils.paramsToObject($stateParams.item);
            if ($scope.item.id > 0)
                $scope.userList = $$sysRes.user.query() //TODO
        }
    }

    $scope.onSave = function () {
//        if ($scope.userList && $scope.userList.length > 0)
//            $scope.userList = $$sysRes.$logicFieldBatch.saveBatch($scope.userList)
    }



    $scope.selectedItems = []

    $scope.userGridOptions = {
        data: 'userList',
        showFooter: true,
        showFilter:true,
        showSelectionCheckbox:true,
        enableRowSelection: true,
        multiSelect: true,
        selectedItems: $scope.selectedItems,
        columnDefs: [
            {field: 'loginName', displayName: '登录名'},
            {field: 'name', displayName: '名称'},
            {field: 'description', displayName: '描述'}
        ]
    }
//    {field:'age', displayName:'Age', cellTemplate: '<div ng-class="{green: row.getProperty(col.field) > 30}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'}]



    $scope.refresh();
}

function sys_role_mixListPlus_tabs_permission($scope, $$sysRes, $stateParams, $$sysConfig) {
//    return tmpl_ctrl_module_entity_mixList_detail($scope, $$sysRes, $stateParams, $$sysConfig.role)
}