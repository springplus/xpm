/**
 * Created by hongxueqian on 14-5-11.
 */


function metadata_dataItemCatalog($state) {

}

function metadata_dataItemCatalog_mixListPlus($scope,$$Data, $$metadataRes,$$stateProxy,$$metadataConfig) {

    return mixListPlusCtrlTmpl($scope,$$Data, $$metadataRes,$$stateProxy,$$metadataConfig.dataItemCatalog)
}

function metadata_dataItemCatalog_mixListPlus_none_detail($scope,$$Data, $$metadataRes, $stateParams, $$metadataConfig) {
    return mixListPlusNoneDetailCtrlTmpl($scope,$$Data,$$metadataRes,$stateParams,$$metadataConfig.dataItemCatalog)
}
