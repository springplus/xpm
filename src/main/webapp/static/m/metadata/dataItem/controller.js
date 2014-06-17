/**
 * Created by hongxueqian on 14-5-11.
 */


function metadata_dataItem($state) {

}

function metadata_dataItem_mixListPlus($scope, $$metadataRes,$$stateProxy,$$metadataConfig) {

    return mixListPlusCtrlTmpl($scope, $$metadataRes,$$stateProxy,$$metadataConfig.dataItem)
}

function metadata_dataItem_mixList_detail($scope, $$metadataRes, $stateParams, $$metadataConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope,$$metadataRes,$stateParams,$$metadataConfig.dataItem)
}
