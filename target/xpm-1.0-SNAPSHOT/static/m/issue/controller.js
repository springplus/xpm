/**
 * Created by hongxueqian on 14-3-3.
 */
function issue($scope,$state) {
    $scope.$parent.loadModulesMenu('sys');
}


function issueMainCtrl($scope, $http, $filter,$routeParams) {
    $scope.loadIssuePage=function(page,target,param){
        //若只有一个参数则target=page
        if(!target)target = page;
        eval("$scope."+target+"='m/tmpl/issue/views/"+page+".html'");
        console.debug(target)
        var o = angular.fromJson("{\"id\":1}");
        console.debug("{\"id\":1}");
        console.debug(o);
        if(!angular.isUndefined(param))
             console.debug(param.id)
    }
    $scope.to=function(name){
        $scope.btnActive = name;
        $scope.loadIssuePage("main_"+name,"_main");
    }

    $scope.pageId=$routeParams.id;
    //检查当前用户是否有权限访问该pageId
    //若有权限则依据pageId加载页面的共公配置信息及当前用户的配置信息
    //获取过滤器数据
    //@TODO 异常处理
    $http.get("m/core/data/list/list_filter.json?pageId="+$scope.pageId).success(function (data, status) {
        $scope.filterList = data;
    });


    $scope.changeFilter = function (selectedfilter) {
        //获取过滤条件数据
        //@TODO 异常处理
        $http.get("m/core/data/list/list_fields.json").success(function (data, status) {
            //获取该页面的所有可查询字段，用于在页面配置选择是否纳入展示字段
            $scope.allFields = data;

            //结合当前的过滤器进行过滤，形成列表上方展示的查询字段
            if (!selectedfilter||!selectedfilter.value) {
                $scope.queryFields = $scope.allFields;
                return;
            }
            console.debug("not empty filter, go on......")
            var queryFields = []
            for (var i = 0; i < selectedfilter.value.length; i++) {
                var ary = $filter('filter')($scope.allFields, {"code": selectedfilter.value[i].fieldCode});
                if (ary.length==1){
                    //设置过滤器的默认值到查询字段中
                    ary[0].default = selectedfilter.value[i].value
                    queryFields.push(ary[0])
                }else{
                    console.error("字段的数据不唯一，字段："+selectedfilter.value[i].fieldCode)
                }
            }
            $scope.queryFields = queryFields;

        });
    }
    //初始化列表
    $scope.changeFilter(null);


    //点击列表项之后，打开详细信息页面
//    $scope.loadPage($$kvs.issueWelcomePage);
}

function issueMainMixListCtrl($scope, $http) {
    //获取数据
    //@TODO 异常处理
    $http.get("m/tmpl/issue/data/issues.json").success(function (data, status) {
        $scope.issueList = data;
    });
    //用于展示列表的选中状态
    $scope.select = function (index) {
        $scope.selectedIndex = index;
    }
    //点击列表项之后，打开详细信息页面
//    $scope.loadDetailPage = function (id) {
//        $scope.detailPage = 'm/tmpl/issue/views/_detail.html?=id' + id
//        $scope.currentId = id;
//        issueMixListDetailCtrl($scope, $http)
//    }
}





