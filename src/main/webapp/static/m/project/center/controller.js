/**
 * Created by hongxueqian on 14-6-27.
 */

function project_center() {

}

function project_center_main($scope,$$Data, $$projectRes, $$stateProxy,$$projectConfig,$$Data) {

    var refresh = function(){
//        $scope.itemList = $$projectRes.project.query();
//        console.debug(">>>res.query('sys_find_test')",$$Data.res.query({sqlKey:'sys_find_test'}));
        $scope.labels = [
            {displayName:'重点的'},
            {displayName:'技术的'},
            {displayName:'管理的'}
        ]
        $scope.fields = [
            {name:"id",displayName:'序号',width:"5%"},
            {name:"status",displayName:'项目状态',width:"10%"},
            {name:"name",displayName:'项目名称',width:"55%"},
            {name:"startDate",displayName:'启动日期',width:"10%"},
            {name:"dueDate",displayName:'最后期限',width:"10%"},
            {name:"progress",displayName:'项目进度',width:"10%",type:'progress',colorField:'status'}
//            ,
//            {name:"description",displayName:'描述',isShow:false}
        ]
        $scope.items = [
            {id:1,name:'it项目管理系统',description:'项目简介...',startDate:'2014-01-05',dueDate:'2015-12-28',status:'red',progress:'40%'},
            {id:2,name:'工程项目管理系统',description:'项目简介...',startDate:'2014-06-05',dueDate:'2015-9-28',status:'blue',progress:'20%'},
            {id:3,name:'运营类项目管理',description:'项目简介...',startDate:'2014-06-05',dueDate:'2015-9-28',status:'green',progress:'90%'}
        ]
//        $scope.ngxListField =xgeeUtils.objectToArray({name:"项目名称"})

    }



    $scope.onItemClick = function(item){
        $$stateProxy.goto('project.info.main',{item:{projectId:item.id}})

    }
    $scope.onLabelClick = function(label){

    }
    $scope.onSelectChange = function(){

    }

    refresh();
}


function project_main_mixList_detail($scope,$$Data, $$projectRes,$stateParams) {
    var params = xgeeUtils.paramsToObject($stateParams.item);
    $scope.entity=params;
    var refresh = function(){
//        $scope.ngxListDataFields = $$projectRes.logicField.query({logic_entity_id:params.id});
//        $scope.ngxListFieldFields =xgeeUtils.objectToArray({name:"字段名称",code:"字段编码"})
    }
    refresh();
}



