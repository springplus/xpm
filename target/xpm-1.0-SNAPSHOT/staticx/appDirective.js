/**
 * Created by hongxueqian on 14-3-21.
 */

//***指令**//
appUtils.directive('ngxGrid', function () {
    return {
        restrict: 'EA',
        templateUrl: 'm/tmpl/component/simpleGrid.html',
        scope: {
            uuid: '=uuid',
            header: '=header',
            data: '=data'
        },
        link: function ($scope, $element, $attr) {
            $scope.headers = appUtils.objectToArray($scope.header);
            $scope.selectedItemIndex = -1;
            $scope.selectedItem = {};
            $scope.click = function (index, row) {
                $scope.selectedItemIndex = index;
                $scope.selectedItem = row.item;
                var item =appUtils.toObject($scope.selectedItem);
                if(appUtils.isDebug)console.debug(">>>"+$scope.uuid+" clicked and item is :",item);
                $scope.$emit(appUtils.EVENT.ngxListItemClicked, {uuid: $scope.uuid, item: item})
            }

            $scope.$on(appUtils.EVENT.ngxListItemPreDelete, function (event, msg) {
                if (msg.uuid == $scope.uuid){
//                    console.debug(">>>receive ngxListItemPreDelete event>>>", $scope.uuid)
//                    console.debug(">>>receive ngxListItemPreDelete msg  >>>", msg)
                    if($scope.selectedItemIndex == -1){
                        console.debug(">>ngxList>>>nothing selected,delete nothing.");
                        return;
                    }
                    $scope.$emit(appUtils.EVENT.ngxListItemDelete, {uuid: $scope.uuid, item:appUtils.toObject($scope.selectedItem)})
                }
            });

            $scope.$on(appUtils.EVENT.ngxListItemDeleted, function (event, msg) {
                if (msg.uuid == $scope.uuid){
                    $scope.selectedItemIndex = -1;
                    $scope.selectedItem = {};
                }
            });

            var dataRefresh = function(oldValue,newValue,scope){
//                console.debug(">>>oldValue>>>",oldValue);
//                console.debug(">>>newValue>>>",newValue);
                $scope.selectedItemIndex = -1;

            }
            //若数据项变动，则量多新选中状态
            $scope.$watch("data",dataRefresh);
        }
    }
})
appUtils.directive('ngxList', function () {
    return {
        restrict: 'EA',
        templateUrl: 'm/tmpl/component/simpleList.html',
        scope: {
            uuid: '=uuid',
            header: '=header',
            data: '=data'
        },
        link: function ($scope, $element, $attr) {
            $scope.headers = appUtils.objectToArray($scope.header);

            $scope.selectedItemIndex = -1;
            $scope.selectedItem = {};
            $scope.click = function (index, row) {
                $scope.selectedItemIndex = index;
                $scope.selectedItem = row.item;
                var item =appUtils.toObject($scope.selectedItem);
                if(appUtils.isDebug)console.debug(">>>"+$scope.uuid+" clicked and item is :",item);
                $scope.$emit(appUtils.EVENT.ngxListItemClicked, {uuid: $scope.uuid, item:item})
            }

            $scope.$on(appUtils.EVENT.ngxListItemPreDelete, function (event, msg) {
                if (msg.uuid == $scope.uuid){
//                    console.debug(">>>receive ngxListItemPreDelete event>>>", $scope.uuid)
//                    console.debug(">>>receive ngxListItemPreDelete msg  >>>", msg)
                    if($scope.selectedItemIndex == -1){
                        console.debug(">>ngxList>>>nothing selected,delete nothing.");
                        return;
                    }
                    var item =appUtils.toObject($scope.selectedItem);
                    $scope.$emit(appUtils.EVENT.ngxListItemDelete, {uuid: $scope.uuid, item:item })
                }
            });

            $scope.$on(appUtils.EVENT.ngxListItemDeleted, function (event, msg) {
                if (msg.uuid == $scope.uuid){
                    $scope.selectedItemIndex = -1;
                    $scope.selectedItem = {};
                }
            });

            var dataRefresh = function(oldValue,newValue,scope){
                $scope.selectedItemIndex = -1;

            }
            //若数据项变动，则量多新选中状态
            $scope.$watch("data",dataRefresh);
        }
    }
})

/**
 * 抽象了指令中常用到的事件，作为通用的事件代理
 * @param $scope
 * @param uuid
 * @param events {doRemoveItem:fun,clickItem:fun}
 */
appUtils.Directive = function($scope,uuid,events){
    var clickItem =events!=null?events.clickItem:null;
    var doRemoveItem=events!=null?events.doRemoveItem:null;
    this.removeItem = function(){
        $scope.$broadcast(appUtils.EVENT.ngxListItemPreDelete,{uuid:uuid})
    }
    $scope.$on(appUtils.EVENT.ngxListItemClicked,function(event,msg){
        if(msg.uuid==uuid){
            if(angular.isFunction(clickItem)){
                clickItem(event,msg)
            }
        }
    })
    $scope.$on(appUtils.EVENT.ngxListItemDelete,function(event,msg){
        if(msg.uuid==uuid){
            if(angular.isFunction(doRemoveItem)){
                doRemoveItem(event,msg)
                //TODO 以下这一句难以保证在doRemoveItem(event,msg)执行后执行
                $scope.$broadcast(appUtils.EVENT.ngxListItemDeleted,{uuid:uuid})
            };
        }
    })
}