/**
 * Created by hongxueqian on 14-3-31.
 */


function sys_role($state) {

}

function sys_role_mixListPlus($scope, $$Data, $$stateProxy,$$sysConfigProvider) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data, $$stateProxy, $$sysConfigProvider.role);
}

function sys_role_mixListPlus_detail($scope, $$Data, $stateParams, $$sysConfigProvider) {
    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, $$sysConfigProvider.role)
}


function sys_role_mixListPlus_user($scope, $$Data, $stateParams, $$sysConfigProvider) {
//    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, $$sysConfigProvider.role)
}

function sys_role_mixListPlus_permission($scope, $$Data, $stateParams, $$sysConfigProvider) {
//    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, $$sysConfigProvider.role)
}