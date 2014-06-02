/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_permission($state) {

}

function sys_permission_mixList($scope, $$Data,$$stateProxy,$$sysConfig) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,$$sysConfig.permission)
}

function sys_permission_mixList_tabs_detail($scope, $$Data, $stateParams, $$sysConfig) {
    return tmpl_ctrl_module_entity_mixList_tabs_detail($scope,$$Data,$stateParams,$$sysConfig.permission)
}

function sys_permission_mixList_tabs_user($scope, $$Data, $stateParams, $state) {

}