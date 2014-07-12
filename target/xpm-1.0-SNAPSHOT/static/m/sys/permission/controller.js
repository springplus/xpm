/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_permission($state) {

}

function sys_permission_mixListPlus($scope,$$Data, $$sysRes,$$stateProxy,$$sysConfig) {
    return mixListPlusCtrlTmpl($scope,$$Data, $$sysRes,$$stateProxy,$$sysConfig.permission)
}

function sys_permission_mixListPlus_tabs_detail($scope, $$Data,$$sysRes, $stateParams, $$sysConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope,$$Data,$$sysRes,$stateParams,$$sysConfig.permission)
}

function sys_permission_mixListPlus_tabs_user($scope,$$Data, $$sysRes, $stateParams, $$sysConfig) {
    //return mixListPlusTabsDetailCtrlTmpl($scope,$$Data,$$sysRes,$stateParams,$$sysConfig.user)
}