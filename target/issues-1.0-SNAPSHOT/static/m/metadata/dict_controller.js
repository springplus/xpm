/**
 * Created by hongxueqian on 14-3-31.
 */
function metadata($state) {
    $state.go('metadata.dict')
}
function metadata_dict($state) {
    $state.go('metadata.dict.mixList')
}

function metadata_dict_mixList($state, $scope, $$Data,$stateParams) {
    var refresh = function(){
        //重新新加列表，更新被加到逻辑实体之后的结果
        $scope.ngxListDictData = $$Data.DataItemCatalog.query();
        $scope.ngxListDictHeader =appUtils.objectToArray({name:"实体名称",code:"实体编码"})
    }
    function clickItemDict(event,msg){
        $state.go('metadata.dict.mixList.detail',{item:appUtils.objectToParams(msg.item)},{location:false})
    }
    function doRemoveItemDict(event,msg){
        $$Data.LogicEntity.delete(msg.item,refresh);
    }

    $scope.dictDirective = new appUtils.Directive($scope,"ngxListDict",{clickItem:clickItemDict,doRemoveItem:doRemoveItemDict})

    refresh();
}

function metadata_dict_mixList_detail($scope, $$Data,$stateParams) {
    $scope.dataItemCatalog = appUtils.paramsToObject($stateParams.item);
    var refresh = function(){
        $scope.ngxListDataItemData = $$Data.DataItem.query({data_item_catalog_id:$scope.dataItemCatalog.id});
        $scope.ngxListDataItemHeader =appUtils.objectToArray({name:"名称",code:"编码"});
        loadDataItem();
    }
    var loadDataItem = function (item){
        if(item==null) item = {type:"Enum",code:"",data_item_catalog_id:$scope.dataItemCatalog.id,value_expression:"{}"};
        $scope.dataItem =item;
        if(item.type!="Enum")item.type="None";
        //$scope.dataItemTypes = $$Data.EnumValue.query({data_item_code:"enum_type"});
        $scope.dataItemTypes = [{code: "Enum",data_item_code:"enum_type",value: "枚举"}]
        $scope.enumValue = []
        if(item.code)$scope.enumValue = $$Data.EnumValue.query({data_item_code:item.code});
        //console.debug("$scope.enumValue>>",$scope.enumValue)
    }

    refresh();




    function clickItem(event,msg){
        loadDataItem(msg.item)
    }


    function doRemoveItem(event,msg){
        $$Data.DataItem.delete(msg.item,refresh)
    }
    $scope.dataItemDirective = new appUtils.Directive($scope,"ngxListDataItem",{clickItem:clickItem,doRemoveItem:doRemoveItem})

    $scope.addItem = function(){
        loadDataItem();
    }

    $scope.saveDataItem = function(){
        $$Data.DataItem.save(appUtils.convertName($scope.dataItem),function(){
            $$Data.EnumValue.saveBatch(appUtils.convertNames($scope.enumValue),refresh)
        })
    }



    $scope.addEnumValue = function (dataItem) {
        $scope.enumValue.push({"id": null,
            "code":"",
            "value": "",
            "dataItemCode": dataItem.code
        })
    }

    $scope.removeEnumValue = function (index) {
        if (angular.isArray($scope.enumValue)){
            if(!confirm("是否删除？"))return;
            var item = $scope.enumValue[index];
            if(item.id){
                $$Data.EnumValue.delete({id:item.id},function(){
                    $scope.enumValue.splice(index,1);
                })
            }else{
                $scope.enumValue.splice(index,1);
            }
        }
        else
            console.debug("$scope.enumValue不是数组！")
    }

//    $scope.keyPress = function($event){
//        console.debug(">>$event.keyCode>>"+$event.keyCode)
//        if($event.keyCode==13){
//            $scope.addEnumValue();
//        }
//    }

}

