/**
 * Created by hongxueqian on 14-5-11.
 */


function metadata_logicEntity($state) {

}

function metadata_logicEntity_mixListPlus($scope, $$Data,$$stateProxy,$$metadataConfig) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,$$metadataConfig.logicEntity)
}

function metadata_logicEntity_mixListPlus_detail($scope, $$Data, $stateParams, $$metadataConfig) {
    return tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,$$metadataConfig.logicEntity)
}

//function metadata_logicEntity_mixListPlus_addLogicEntity($scope, $$Data, $stateParams, $$metadataConfig) {
//
//}
