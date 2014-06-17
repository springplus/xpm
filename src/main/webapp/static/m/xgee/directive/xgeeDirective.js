/**
 * Created by hongxueqian on 14-3-21.
 */


xgee.EVENT = {
    ngxListItemPreDelete: "ngxListItemPreDelete",
    ngxListItemDelete: "ngxListItemDelete",
    ngxListItemDeleted: "ngxListItemDeleted",
    ngxListItemClicked: "ngxListItemClicked"
}

//***指令**//
xgee.directive('ngxGrid', function () {
    return {
        restrict: 'EA',
        templateUrl: 'm/xgee/directive/simpleGrid.html',
        scope: {
            uuid: '=uuid',
            header: '=header',
            data: '=data'
        },
        link: function ($scope, $element, $attr) {
            $scope.headers = xgeeUtils.objectToArray($scope.header);
            $scope.selectedItemIndex = -1;
            $scope.selectedItem = {};
            $scope.click = function (index, row) {
                $scope.selectedItemIndex = index;
                $scope.selectedItem = row.item;
                var item = xgeeUtils.toObject($scope.selectedItem);
                if (xgeeUtils.isDebug)console.debug(">>>" + $scope.uuid + " clicked and item is :", item);
                $scope.$emit(xgee.EVENT.ngxListItemClicked, {uuid: $scope.uuid, item: item})
            }

            $scope.$on(xgee.EVENT.ngxListItemPreDelete, function (event, msg) {
                if (msg.uuid == $scope.uuid) {
//                    console.debug(">>>receive ngxListItemPreDelete event>>>", $scope.uuid)
//                    console.debug(">>>receive ngxListItemPreDelete msg  >>>", msg)
                    if ($scope.selectedItemIndex == -1) {
                        console.debug(">>ngxList>>>nothing selected,delete nothing.");
                        return;
                    }
                    $scope.$emit(xgee.EVENT.ngxListItemDelete, {uuid: $scope.uuid, item: xgeeUtils.toObject($scope.selectedItem)})
                }
            });

            $scope.$on(xgee.EVENT.ngxListItemDeleted, function (event, msg) {
                if (msg.uuid == $scope.uuid) {
                    $scope.selectedItemIndex = -1;
                    $scope.selectedItem = {};
                }
            });

            var dataRefresh = function (oldValue, newValue, scope) {
//                console.debug(">>>oldValue>>>",oldValue);
//                console.debug(">>>newValue>>>",newValue);
                $scope.selectedItemIndex = -1;

            }
            //若数据项变动，则量多新选中状态
            $scope.$watch("data", dataRefresh);
        }
    }
})
xgeeUtils.directive('ngxList', function () {
    return {
        restrict: 'EA',
        templateUrl: 'm/xgee/directive/simpleList.html',
        scope: {
            uuid: '=uuid',
            header: '=header',
            data: '=data'
        },
        link: function ($scope, $element, $attr) {
            $scope.headers = xgeeUtils.objectToArray($scope.header);

            $scope.selectedItemIndex = -1;
            $scope.selectedItem = {};
            $scope.click = function (index, row) {
                $scope.selectedItemIndex = index;
                $scope.selectedItem = row.item;
                var item = xgeeUtils.toObject($scope.selectedItem);
                if (xgeeUtils.isDebug)console.debug(">>>" + $scope.uuid + " clicked and item is :", item);
                $scope.$emit(xgee.EVENT.ngxListItemClicked, {uuid: $scope.uuid, item: item})
            }

            $scope.$on(xgee.EVENT.ngxListItemPreDelete, function (event, msg) {
                if (msg.uuid == $scope.uuid) {
//                    console.debug(">>>receive ngxListItemPreDelete event>>>", $scope.uuid)
//                    console.debug(">>>receive ngxListItemPreDelete msg  >>>", msg)
                    if ($scope.selectedItemIndex == -1) {
                        console.debug(">>ngxList>>>nothing selected,delete nothing.");
                        return;
                    }
                    var item = xgeeUtils.toObject($scope.selectedItem);
                    $scope.$emit(xgee.EVENT.ngxListItemDelete, {uuid: $scope.uuid, item: item })
                }
            });

            $scope.$on(xgee.EVENT.ngxListItemDeleted, function (event, msg) {
                if (msg.uuid == $scope.uuid) {
                    $scope.selectedItemIndex = -1;
                    $scope.selectedItem = {};
                }
            });

            var dataRefresh = function (oldValue, newValue, scope) {
                $scope.selectedItemIndex = -1;

            }
            //若数据项变动，则量多新选中状态
            $scope.$watch("data", dataRefresh);
        }
    }
})

xgeeUtils.directive('ngxSelect', function ($parse) {
    return {
        restrict: 'EA',
        templateUrl: 'm/xgee/directive/select.html',
        scope: {
            uuid: '=uuid',
            data: '=data',
            text:'=text',
            label: '=label',
            value: '=value'
//            ,selectedItems :'=selectedItems'
        },
        link: function ($scope, $element, $attrs) {
            var ref = {
//                onEnable: $attrs.onEnable && $parse($attrs.onEnable),
//                onDisable: $attrs.onDisable && $parse($attrs.onDisable),
                onChange: $attrs.onChange && $parse($attrs.onChange)
            };
            $scope.selectedItems = []
            $scope.selectedLabel = $scope.text?$scope.text:"请选择"

            $scope.extended = false;
//            $element.addClass('active visible')
            $scope.select = function (obj) {
//                console.debug(">>>event>>>",event);
                if ($scope.extended) {
                    $element.children().last().removeClass('visible')
                    $element.children().last().addClass('hidden')
                    $scope.extended = false;
                } else {
                    $element.children().last().removeClass('hidden')
                    $element.children().last().addClass('visible')
                    $scope.extended = true;
                }
            }

            $scope.selectItem = function (index, item) {
                item.checked = item.checked ? false : true;
                $scope.selectedItems.splice(0, $scope.selectedItems.length);
                for (var i in $scope.data) {
                    if ($scope.data[i].checked) {
                        $scope.selectedItems.push($scope.data[i]);
                        console.debug(">>>$scope.selectedItems>>>",$scope.selectedItems)
                    }
                }
                console.debug(">>$scope.label>>",$scope.label)
                if ($scope.selectedItems.length == 0)
                    $scope.selectedLabel = $scope.text?$scope.text:"请选择"
                if ($scope.selectedItems.length == 1)
                    $scope.selectedLabel = $scope.selectedItems[0][$scope.label]
                else if ($scope.selectedItems.length > 1)
                    $scope.selectedLabel =  $scope.selectedItems[0][$scope.label] + "...["+ $scope.selectedItems.length+"]"

                if (ref.onChange) {
                    ref.onChange($scope);
                }
                console.debug(">>>$scope.selectedLabel>>>",$scope.selectedLabel)
            }
        }
    }
})


/**
 * 抽象了指令中常用到的事件，作为通用的事件代理
 * @param $scope
 * @param uuid
 * @param events {doRemoveItem:fun,clickItem:fun}
 */
xgeeUtils.Directive = function ($scope, uuid, events) {
    var clickItem = events != null ? events.clickItem : null;
    var doRemoveItem = events != null ? events.doRemoveItem : null;
    this.removeItem = function () {
        $scope.$broadcast(xgee.EVENT.ngxListItemPreDelete, {uuid: uuid})
    }
    $scope.$on(xgee.EVENT.ngxListItemClicked, function (event, msg) {
        if (msg.uuid == uuid) {
            if (angular.isFunction(clickItem)) {
                clickItem(event, msg)
            }
        }
    })
    $scope.$on(xgee.EVENT.ngxListItemDelete, function (event, msg) {
        if (msg.uuid == uuid) {
            if (angular.isFunction(doRemoveItem)) {
                doRemoveItem(event, msg)
                //TODO 以下这一句难以保证在doRemoveItem(event,msg)执行后执行
                $scope.$broadcast(xgee.EVENT.ngxListItemDeleted, {uuid: uuid})
            }
            ;
        }
    })
}