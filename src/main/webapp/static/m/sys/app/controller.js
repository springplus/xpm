/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_app($state) {

}

function sys_app_mixListPlus($scope, $$sysRes,$$stateProxy,$$sysConfig) {
    return mixListPlusCtrlTmpl($scope, $$sysRes,$$stateProxy,$$sysConfig.app)
}

function sys_app_mixListPlus_tabs_detail($scope, $$sysRes, $stateParams, $$sysConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope,$$sysRes,$stateParams,$$sysConfig.app)
}
