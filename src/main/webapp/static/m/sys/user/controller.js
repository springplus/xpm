/**
 * Created by hongxueqian on 14-3-31.
 */
function sys_user($state) {
//   $state.go('sys.user.mixList')
}

function sys_user_mixList($$stateProxy, $scope, $$Data) {
    $scope.refresh = function () {
        //重新新加列表，更新被加到逻辑实体之后的结果
        $scope.ngxListData = $$Data.user.query();
        $scope.ngxListHeader = {name: "用户名称", login_name: "登录账号"}
    }
    function clickItem(event, msg) {
        $$stateProxy.goto('sys.user.mixList.detail', msg.item)
    }

    function doRemoveItem(event, msg) {
        $$Data.user.delete(msg.item, function () {
            appUtils.tipSuccess("成功删除！")
            $scope.refresh();
        });
    }

    $scope.userDirective = new appUtils.Directive($scope, "ngx_grid_user", {clickItem: clickItem, doRemoveItem: doRemoveItem})

    $scope.refresh();
}

function sys_user_mixList_detail($scope, $filter, $$Data, $stateParams, $state) {

    $scope.refresh = function () {
        $scope.item = $$Data.user.get(appUtils.paramsToObject($stateParams.item))
    }
    $scope.refresh();


    $scope.addItem = function () {
        $scope.refresh();
    }

    $scope.saveItem = function () {
        $$Data.user.save(appUtils.convertName($scope.item), $scope.$parent.refresh)
    }


    $scope.addEnumValue = function (dataItem) {
        $scope.enumValue.push({"id": null,
            "code": "",
            "value": "",
            "dataItemCode": dataItem.code
        })
    }

    $scope.removeEnumValue = function (index) {
        if (angular.isArray($scope.enumValue)) {
            if (!confirm("是否删除？"))return;
            var item = $scope.enumValue[index];
            if (item.id) {
                $$Data.EnumValue.delete({id: item.id}, function () {
                    $scope.enumValue.splice(index, 1);
                })
            } else {
                $scope.enumValue.splice(index, 1);
            }
        }
        else
            console.debug("$scope.enumValue不是数组！")
    }

}

function sys_user_profile($scope, $filter, $$MD, $http,$stateParams) {
    $scope.item = {};
    $http.get($$MD.url("/api/auth/isLogged")).success(function (data) {
        $scope.item = data;
    });
    console.debug(">>>$stateParams>>>", $stateParams)
    $scope.item.$createDate = $filter('date')($scope.item.createDate, 'yyyy-MM-dd');
}