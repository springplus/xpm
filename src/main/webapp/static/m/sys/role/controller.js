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
//    return tmpl_ctrl_module_entity_mixList_detail($scope, $$sysRes, $stateParams, $$sysConfig.role)
}

function sys_role_mixListPlus_tabs_permission($scope, $$sysRes, $stateParams, $$sysConfig) {
//    return tmpl_ctrl_module_entity_mixList_detail($scope, $$sysRes, $stateParams, $$sysConfig.role)
}