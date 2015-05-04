/**
 * Created by hongxueqian on 14-5-11.
 */


function metadata_dataItem($state) {

}

function metadata_dataItem_mixListPlus($scope,$$Data, $$metadataRes,$$stateProxy,$$metadataConfig) {
    return mixListPlusCtrlTmpl($scope, $$Data,$$metadataRes,$$stateProxy,$$metadataConfig.dataItem)
}

function metadata_dataItem_mixList_detail($scope, $$Data,$$metadataRes, $stateParams, $$metadataConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope,$$Data,$$metadataRes,$stateParams,$$metadataConfig.dataItem)
}
