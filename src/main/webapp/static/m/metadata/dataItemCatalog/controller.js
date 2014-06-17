/**
 * Created by hongxueqian on 14-5-11.
 */


function metadata_dataItemCatalog($state) {

}

function metadata_dataItemCatalog_mixListPlus($scope, $$metadataRes,$$stateProxy,$$metadataConfig) {

    return mixListPlusCtrlTmpl($scope, $$metadataRes,$$stateProxy,$$metadataConfig.dataItemCatalog)
}

function metadata_dataItemCatalog_mixListPlus_none_detail($scope, $$metadataRes, $stateParams, $$metadataConfig) {
    return mixListPlusNoneDetailCtrlTmpl($scope,$$metadataRes,$stateParams,$$metadataConfig.dataItemCatalog)
}
