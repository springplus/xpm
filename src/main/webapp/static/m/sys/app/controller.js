/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_app($state) {

}

function sys_app_mixListPlus($scope,$$Data, $$sysRes,$$stateProxy,$$sysConfig) {
    return mixListPlusCtrlTmpl($scope,$$Data, $$sysRes,$$stateProxy,$$sysConfig.app)
}

function sys_app_mixListPlus_tabs_detail($scope,$$Data, $$sysRes, $stateParams, $$sysConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope,$$Data,$$sysRes,$stateParams,$$sysConfig.app)
}
