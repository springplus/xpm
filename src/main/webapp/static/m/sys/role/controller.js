/**
 * Created by hongxueqian on 14-3-31.
 */


function sys_role($state) {

}

function sys_role_mixListPlus($scope, $$Data, $$stateProxy,$$sysConfig) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data, $$stateProxy, $$sysConfig.role);
}

function sys_role_mixListPlus_detail($scope, $$Data, $stateParams, $$sysConfig) {
    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, $$sysConfig.role)
}


function sys_role_mixListPlus_user($scope, $$Data, $stateParams, $$sysConfig) {
//    return tmpl_ctrl_module_entity_mixList_detail($scope, $$Data, $stateParams, $$sysConfig.role)
}