/**
 * Created by hongxueqian on 14-3-31.
 */


function report_sqlConfig($state) {


}
function report_sqlConfig_mixListPlus($scope, $$Data, $$reportRes, $$stateProxy, $$reportConfig) {
    return mixListPlusCtrlTmpl($scope, $$Data, $$reportRes, $$stateProxy, $$reportConfig.sqlConfig);
}

function report_sqlConfig_mixListPlus_tabs_detail($scope, $$Data, $$reportRes, $stateParams, $$reportConfig) {
    return mixListPlusTabsDetailCtrlTmpl($scope, $$Data, $$reportRes, $stateParams, $$reportConfig.sqlConfig)
}

function report_sqlConfig_mixListPlus_tabs_test($scope, $$Data, $$reportRes, $stateParams, $$reportConfig) {
    $$Data.res.query({sqlKey: $scope.$parent.currentItem.sqlKey},function(data){
        var items = data;
        $scope.fields = [];
        for (var itemIndex in items){
            var item = items[itemIndex]
            for (var name in item) {
                if(name.indexOf("$")!=-1)continue;
                $scope.fields.push({name:name,value:item[name]})
            }
            break;
        }
    })

    $scope.queryCount = 1;

    $scope.loadPartTwo = function(){
        $scope.part = 'm/report/sqlConfig/partTwo.html';
        console.debug(">>>$scope.part>>>",$scope.part)
        partTwoController($scope,$$Data);
    }
}


function partTwoController($scope,$$Data){
    $scope.partOne = "partOne！";
    $scope.partTwoFun = function(){
        $$Data.res.query({sqlKey: $scope.$parent.currentItem.sqlKey},function(data){
            $scope.partOne = data;
            console.debug(">>>data>>>",$scope.partOne);
        });
    }
}

function report_sqlConfig_mixListPlus_tabs_parameter($scope, $$Data, $$reportRes, $stateParams, $$reportConfig) {

    $scope.parameters = [];
    $scope.currentParameter = {
        name: "",
        config: {
            fieldType: {},
            displayName: "",
            identifier: ""
        }
    }

    $scope.fieldTypes = [
        {name: "select", code: 'type_select'},
        {name: "text", code: 'type_text'},
        {name: "date", code: 'type_date'}
    ]
    $scope.onTypeChange = function (data) {
        console.debug(">>>data.selectedValueStr>>", data.selectedValueStr)
        $scope.fieldTypeDefine = xgee.define.fieldTypeDefine[data.selectedValueStr];
    }
    $scope.rules = [
//        emplty:{value}
    ]

    $scope.onSelectChange = function (data) {

        $scope.fieldType = data.selectedValueStr;
        $scope.$parent.fieldType = data.selectedValueStr;
        console.debug(">>>fieldType>>>", $scope.fieldType)
    }
    $scope.refresh = function () {
        console.debug("$stateParams", $stateParams);
        if ($stateParams && $stateParams.item) {
            $scope.item = xgeeUtils.paramsToObject($stateParams.item);
            if ($scope.item.id > 0)
                $scope.userList = $$reportRes.user.query() //TODO
        }
    }

    $scope.onSave = function () {
//        if ($scope.userList && $scope.userList.length > 0)
//            $scope.userList = $$reportRes.$logicFieldBatch.saveBatch($scope.userList)
    }


    $scope.onParseSql = function () {
        $$reportRes.sqlConfig.query({sql_key: $scope.$parent.currentItem.sql_key})

        $scope.items = $$Data.reportHelper.parse({sql: $scope.$parent.currentItem.content}, function (data) {
            console.debug(">>>data:", data)
            for (var i in data) {
//                console.debug(">>>i:",i)
//                console.debug(">>>data[i]:",data[i])
            }
        })
        console.debug(">>>$scope.items>>>", $scope.items);

    }

    $scope.onParseSql();

    $scope.selectedItems = []

    $scope.userGridOptions = {
        data: 'userList',
        showFooter: true,
        showFilter: true,
        showSelectionCheckbox: true,
        enableRowSelection: true,
        multiSelect: true,
        selectedItems: $scope.selectedItems,
        columnDefs: [
            {field: 'loginName', displayName: '登录名'},
            {field: 'name', displayName: '名称'},
            {field: 'description', displayName: '描述'}
        ]
    }
//    {field:'age', displayName:'Age', cellTemplate: '<div ng-class="{green: row.getProperty(col.field) > 30}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'}]

//    $scope.refresh();
}
