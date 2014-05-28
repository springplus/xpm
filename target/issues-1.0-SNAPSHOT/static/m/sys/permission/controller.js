/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_permission($state) {

}

function sys_permission_mixList($scope, $$Data,$$stateProxy,$$sysConfigProvider) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,$$sysConfigProvider.permission)
}

function sys_permission_mixList_detail($scope, $$Data, $stateParams, $$sysConfigProvider) {
    return tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,$$sysConfigProvider.permission)
}

function sys_permission_mixList_user($scope, $$Data, $stateParams, $state) {

}