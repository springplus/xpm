/**
 * Created by hongxueqian on 14-3-3.
 */
function metadata($state) {
    $state.go('metadata.main')
}
function metadata_main($state, $scope, $http, $filter, $$MD) {
    $scope.to = function (name) {
        $scope.btnActive = name;
        $state.go('metadata.main.' + name)
    }
    $scope.changeFilter = function (selectedfilter) {
        //获取过滤条件数据
        //@TODO 异常处理
        $http.get("m/core/data/list/list_fields.json").success(function (data, status) {
            //获取该页面的所有可查询字段，用于在页面配置选择是否纳入展示字段
            $scope.allFields = data;

            //结合当前的过滤器进行过滤，形成列表上方展示的查询字段
            if (!selectedfilter || !selectedfilter.value) {
                $scope.queryFields = $scope.allFields;
                return;
            }
            console.debug("not empty filter, go on......")
            var queryFields = []
            for (var i = 0; i < selectedfilter.value.length; i++) {
                var ary = $filter('filter')($scope.allFields, {"code": selectedfilter.value[i].fieldCode});
                if (ary.length == 1) {
                    //设置过滤器的默认值到查询字段中
                    ary[0].default = selectedfilter.value[i].value
                    queryFields.push(ary[0])
                } else {
                    console.error("字段的数据不唯一，字段：" + selectedfilter.value[i].fieldCode)
                }
            }
            $scope.queryFields = queryFields;

        });
    }
    //初始化列表
    $scope.changeFilter(null);
    //点击列表项之后，打开详细信息页面
//    $scope.loadPage($$kvs.metadataWelcomePage);
}

function metadata_main_mixList($state, $scope, $$Data,$stateParams) {
    var refresh = function(){
        //重新新加列表，更新被加到逻辑实体之后的结果
        $scope.ngxListDataFactual = $$Data.FactualEntity.query();
        $scope.ngxListFieldFactual =appUtils.objectToArray({type:"类型",name:"实体名称",code:"实体编码"})

        $scope.ngxListData = $$Data.LogicEntity.query();
        $scope.ngxListField =appUtils.objectToArray({type:"类型",name:"实体名称",code:"实体编码"})

    }
    function doRemoveItemFactual(event,msg){
        $$Data.LogicEntity.save(msg.item,refresh);
    }
    function clickItemLogic(event,msg){
        $state.go('metadata.main.mixList.detail',{item:appUtils.objectToParams(msg.item)},{location:false})
    }
    function doRemoveItemLogic(event,msg){
        $$Data.LogicEntity.delete(msg.item,refresh);
    }

    $scope.factualDirective = new appUtils.Directive($scope,"ngxListFactual",{doRemoveItem:doRemoveItemFactual})
    $scope.logicDirective = new appUtils.Directive($scope,"ngxListLogic",{clickItem:clickItemLogic,doRemoveItem:doRemoveItemLogic})

    refresh();
}

function metadata_main_mixList_detail($scope, $$Data,$stateParams) {
    var params = appUtils.paramsToObject($stateParams.item);
    var refresh = function(){
        $scope.ngxListDataFields = $$Data.LogicField.query({logic_entity_id:params.id});
        $scope.ngxListFieldFields =appUtils.objectToArray({name:"字段名称",code:"字段编码"})
    }
    refresh();


    function clickItem(event,msg){
        $scope.dataItem =msg.item;
        $scope.dataItemType = $$Data.EnumValue.query({data_item_code:"enum_type"});
        console.debug(">>>>$scope.dataItemType>>>",$scope.dataItemType)

//        $scope.enumValue = $$Data.EnumValue.query();
    }
    function doRemoveItem(event,msg){
        $$Data.LogicField.delete({id:msg.item.id},refresh)
    }
    $scope.logicFieldDirective = new appUtils.Directive($scope,"ngxListFields",{clickItem:clickItem,doRemoveItem:doRemoveItem})

    $scope.importFields = function(){
        $$Data.LogicField.save(params,refresh)
    }

    $scope.deleteField =function(){
        $$Data.LogicField.delete(1,refresh)
    }

    $scope.enumValue = [];
    $scope.addEnumValue = function () {
        $scope.enumValue.push({"id": -1,
            "code": "",
            "value": "",
            "dataItemCode": ""
        })
    }

    $scope.removeEnumValue = function (index) {
        if (angular.isArray($scope.enumValue))
            $scope.enumValue.splice(index,1);
        else
            console.debug("$scope.enumValue不是数组！")
    }

    $scope.keyPress = function($event){
        console.debug(">>$event.keyCode>>"+$event.keyCode)
        if($event.keyCode==13){
            $scope.addEnumValue();
        }
    }

}


function metadata_main_list($scope, $http) {

}



