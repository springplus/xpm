/**
 * Created by hongxueqian on 14-5-11.
 */


function metadata_logicEntity($state) {

}


//function metadata_logicEntity_mixGridPlus($scope, $$metadataRes, $$stateProxy, $$metadataConfig) {
//    return tmpl_ctrl_module_entity_mixGrid($scope, $$metadataRes, $$stateProxy, $$metadataConfig.logicEntity)
//}

function metadata_logicEntity_mixListPlus($scope, $$metadataRes, $$stateProxy, $$metadataConfig) {
    return mixListPlusCtrlTmpl($scope, $$metadataRes, $$stateProxy, $$metadataConfig.logicEntity)
}



function metadata_logicEntity_mixListPlus_tabs_detail($scope,$$Data, $$metadataRes, $stateParams, $$metadataConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope,$$Data, $$metadataRes, $stateParams, $$metadataConfig.logicEntity)
}

function metadata_logicEntity_mixListPlus_addLogicEntity($scope,$$Data, $$metadataRes, $stateParams, $$metadataConfig) {

    $scope.refresh = function () {
        $scope.factualEntityList = $$metadataRes.factualEntity.query()
    }

    $scope.selectedItems = []

    $scope.factualEntityGridOptions = {
        data: 'factualEntityList',
        multiSelect: false,
        selectedItems: $scope.selectedItems,
        columnDefs: [
            {field: 'code', displayName: '实体编码'},
            {field: 'name', displayName: '实体名称或描述'}
        ]

    }
    $scope.nextStep = function () {
        if ($scope.selectedItems.length == 0) {
            xgeeUtils.tipInfo("请先选择一项。")
        } else {
            var item = $scope.selectedItems[0];
            $$metadataRes.logicEntity.save({name: item.name, code: item.code}, function () {
                $scope.$parent.refresh();
                $scope.$parent.nextStep();
            })
        }
    }
    $scope.refresh();
}
function metadata_logicEntity_mixListPlus_crudLogicField($scope, $$Data,$$metadataRes, $stateParams, $$metadataConfig) {
    $scope.refresh = function () {
        console.debug("$stateParams", $stateParams);
        if ($stateParams && $stateParams.item) {
            $scope.item = xgeeUtils.paramsToObject($stateParams.item);
            if ($scope.item.id > 0)
                $scope.logicFieldList = $$metadataRes.logicField.query({logic_entity_id: $scope.item.id})
        }
    }
    $scope.importItems = function () {
        $$metadataRes.$metadataRes.save({res: 'importFieldsByLogicEntityId', id: $scope.item.id}, $scope.refresh)
    }
    $scope.saveItems = function () {
        if ($scope.logicFieldList && $scope.logicFieldList.length > 0)
            $scope.logicFieldList = $$metadataRes.$logicFieldBatch.saveBatch($scope.logicFieldList)
    }
    $scope.deleteItems = function () {
        if ($scope.selectedItems.length == 0)xgeeUtils.tipInfo("请先选择需删除的项。")
        else $$metadataRes.logicField.delete({id: xgeeUtils.linkArrayToString($scope.selectedItems), code: 'xxx'}, $scope.refresh)
    }

    $scope.selectedItems = []

    $scope.logicFieldGridOptions = {
        data: 'logicFieldList',
        enableCellSelection: true,
        enableRowSelection: true,
        multiSelect: true,
        enableCellEditOnFocus: true,
        selectedItems: $scope.selectedItems,
        columnDefs: [
            {field: 'code', displayName: '编码', enableCellEdit: false},
            {field: 'name', displayName: '名称'},
            {field: 'description', displayName: '描述'}
        ]
    }


    $scope.refresh();


}
