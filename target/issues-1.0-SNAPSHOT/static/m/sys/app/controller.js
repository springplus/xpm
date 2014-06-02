/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_app($state) {

}

function sys_app_mixListPlus($scope, $$Data,$$stateProxy,$$sysConfig) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,$$sysConfig.app)
}

function sys_app_mixListPlus_tabs_detail($scope, $$Data, $stateParams, $$sysConfig) {
    return tmpl_ctrl_module_entity_mixList_tabs_detail($scope,$$Data,$stateParams,$$sysConfig.app)
}
