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

            var dataRefresh = function (newValue,oldValue) {
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

            var dataRefresh = function (newValue,oldValue) {
                $scope.selectedItemIndex = -1;

            }
            //若数据项变动，则量多新选中状态
            $scope.$watch("data", datRefresh);
        }
    }
})

/**
 *
 */
xgeeUtils.directive('ngxSelect', function ($parse) {
    return {
        restrict: 'EA',
        templateUrl: 'm/xgee/directive/select.html',
        scope: {
            uuid: '@uuid',
            data: '=data',
            text: '@text',
            label: '@label',
            value: '@value',
            defaultValue: '@default',
            type: '@type', //single|multi ,默认为single
            change: '&'
        },
        link: function ($scope, $element, $attrs) {
            var TYPE_SINGLE = "single";
            var TYPE_MULTI = "multi"
            if (angular.isUndefined($scope.type) || $scope.type.toLowerCase() != TYPE_MULTI) $scope.type = TYPE_SINGLE;
            else $scope.type = TYPE_MULTI;

            $scope.selectedItems = []
            $scope.selectedLabel = $scope.text ? $scope.text : "-请选择-"

            //设置默认值
            var setDefault=function() {
                console.debug(">>>$scope.defaultValue1>>>",$scope.defaultValue)
                if ($scope.defaultValue) {
                    console.debug(">>>$scope.defaultValue2>>>",$scope.defaultValue)
                    var values = ($scope.defaultValue + "").split(",");
                    for (var vi in values) {
                        for (var i in $scope.data) {
                            if ($scope.data[i][$scope.value] == values[vi]) {
                                $scope.data[i].checked = true;
                                $scope.selectedItems.push($scope.data[i]);
                                console.debug(">>>$scope.selectedItems>>>", $scope.selectedItems)
                            }
                        }
                    }
                }
                render();
                callback(0);
            }
            setDefault();

            $scope.extended = false;
            $scope.onSelect = function (obj) {
                //若无数据项则不展开
//                if (!$scope.data||!$scope.data.length)return;
//                console.debug(">>>$scope.data>>>",$scope.data);
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

            $scope.onItemClick = function (index, item) {
                if ($scope.type == TYPE_MULTI) {
                    //-多选进，加上这个事件，点击onItemClick相当于执行两次onSelect，即展示状态不改变
                    $scope.onSelect()
                    item.checked = item.checked ? false : true;
                    $scope.selectedItems.splice(0, $scope.selectedItems.length);
                    for (var i in $scope.data) {
                        if ($scope.data[i].checked) {
                            $scope.selectedItems.push($scope.data[i]);
                            //console.debug(">>>$scope.selectedItems>>>", $scope.selectedItems)
                        }
                    }
                } else {
                    $scope.selectedItems[0] = $scope.data[index]
                }
                //选择之后调整页面上需要展示的内容
                render();
                //回调onChange事件

            }

            function render() {
                if ($scope.selectedItems.length == 0)
                    $scope.selectedLabel = $scope.text ? $scope.text : "-请选择-"
                if ($scope.selectedItems.length == 1)
                    $scope.selectedLabel = $scope.selectedItems[0][$scope.label]
                else if ($scope.selectedItems.length > 1)
                    $scope.selectedLabel = $scope.selectedItems[0][$scope.label] + "...[" + $scope.selectedItems.length + "]"
            }

            function callback(index){
                if (angular.isFunction($scope.change)) {
                    var selectedValueStr = xgeeUtils.linkArrayToString($scope.selectedItems, $scope.value, ",")
                    var data = {
                        uuid: $scope.uuid,
                        selectedValueStr: selectedValueStr,
                        selectedItems: $scope.selectedItems,
                        index: index,
                        valueField: $scope.value
                    }
                    $scope.change({data: data});

//                    console.debug(">>>$scope.selectedLabel>>>", $scope.selectedLabel)
                }
//                console.debug(">>>$scope.selectedLabel>>>", $scope.selectedLabel)
            }
        }
    }
})


xgeeUtils.directive('ngxDesignerToolbar', function ($parse) {
    return {
        restrict: 'ECA',
        priority: 401,
        terminal: true,
        controller: angular.noop,
        templateUrl: 'm/xgee/directive/ngxDesignerToolbar.mustache',
        scope: {
            uuid: '@uuid',
            selectTo: '@selectTo'
        },
        link: function ($scope, $element, $attrs) {
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