/**
 * Created by hongxueqian on 14-5-11.
 */


function metadata_dataItem($state) {

}

function metadata_dataItem_mixList($scope, $$Data,$$stateProxy,$$metadataConfig) {
    return tmpl_ctrl_module_entity_mixList($scope, $$Data,$$stateProxy,$$metadataConfig.dataItem)
}

function metadata_dataItem_mixList_detail($scope, $$Data, $stateParams, $$metadataConfig) {
    return tmpl_ctrl_module_entity_mixList_detail($scope,$$Data,$stateParams,$$metadataConfig.dataItem)
}
