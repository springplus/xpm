/**
 * Created by hongxueqian on 14-5-11.
 */

var appConfig = {moduleName: 'sys', entityName: 'app',list:{title:'应用列表', header: {id:'序号',name: '名称', code: '应用编码'}}};

function sys_app($state) {

}

function sys_app_mixList($scope, $$Data,$$stateProxy) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,appConfig)
}

function sys_app_mixList_detail($scope, $$Data, $stateParams, $state) {
    return tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,appConfig)
}
