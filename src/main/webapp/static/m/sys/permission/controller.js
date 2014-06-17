/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_permission($state) {

}

function sys_permission_mixListPlus($scope, $$sysRes,$$stateProxy,$$sysConfig) {
    return mixListPlusCtrlTmpl($scope, $$sysRes,$$stateProxy,$$sysConfig.permission)
}

function sys_permission_mixListPlus_tabs_detail($scope, $$sysRes, $stateParams, $$sysConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope,$$sysRes,$stateParams,$$sysConfig.permission)
}

function sys_permission_mixListPlus_tabs_user($scope, $$sysRes, $stateParams, $$sysConfig) {
    //return mixListPlusTabsDetailCtrlTmpl($scope,$$sysRes,$stateParams,$$sysConfig.user)
}