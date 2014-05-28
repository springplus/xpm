/**
 * Created by hongxueqian on 14-5-11.
 */


function sys_app($state) {

}

function sys_app_mixListPlus($scope, $$Data,$$stateProxy,$$sysConfigProvider) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,$$sysConfigProvider.app)
}

function sys_app_mixListPlus_detail($scope, $$Data, $stateParams, $$sysConfigProvider) {
    return tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,$$sysConfigProvider.app)
}
