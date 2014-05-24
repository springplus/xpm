/**
 * Created by hongxueqian on 14-5-11.
 */

var permissionConfig = {moduleName: 'sys', entityName: 'Permission',list:{title:'权限列表', header: {id:'序号',name:'权限名称',text: '权限描述符'}}};

function sys_permission($state) {

}

function sys_permission_mixList($scope, $$Data,$$stateProxy) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,permissionConfig)
}

function sys_permission_mixList_detail($scope, $$Data, $stateParams, $state) {
    return tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,permissionConfig)
}
