;
/**
 * Created by hongxueqian on 14-7-11.
 *
 * $scope.$alias$.include
 * $scope.$alias$.include
 */

var views_tabs_simple = ViewBaseCtrl.extend(function (base) {
    return {
        init: function () {
        },
        switch: function () {
            console.debug("views_list_simple.doAction")
        }
    }
});


var views_layout_mixListPlus = ViewBaseCtrl.extend(function () {
    return {
        init: function () {
        }
    }
});

var views_detail_simple = ViewBaseCtrl.extend(function (base) {
    return {
        init: function () {
        },
        afterInit: function (cfg) {
            console.debug(">>from>>", "#" + cfg.alias + "Form")
        },
        save2: function () {

        },
        save: function (action) {

            this.owner.item.name.$dirty = true;
            this.owner.item.name.invalid = true;

//            console.debug("this.owner.cfg.form>>",this.owner.cfg.form)
//            $("#XForm").form(this.owner.cfg.form, {
//                inline: false,
//                on: 'blur'
//            })
//            //            if ($("#" + this.owner.cfg.alias + "Form").form('validate form')) {
//
//            if ($("#XForm").form('validate form')) {
//                console.debug(">>validate ok");
//            }
        }
    }
});

var views_detail_simple2 = ViewBaseCtrl.extend(function () {
    return {
        init: function () {
        }
    }
});

function views_tabs_simple4($scope, $$Data) {

    function init(owner) {

    }

    function load() {

    }

    $scope.switch = function () {
        console.debug("views_list_simple.doAction")
    }

    return {
        init: init,
        load: load
    }
}

function views_layout_mixListPlus4($scope, $$Data) {
    function init(owner) {

    }

    function load() {

    }

    return {
        init: init,
        load: load
    }
}

function views_detail_simple4($scope, $$Data) {

//    this.owner = {};
//
//    function init(owner) {
//        this.owner = owner;
//        console.debug(">>>views_detail_simple>>>init(cfg)>>>", owner.cfg)
//        //初始化表单验证
//        $(document).ready(function () {
//            $("#" + owner.cfg.alias + "Form").form(owner.cfg.form, {
//                inline: false,
//                on: 'blur'
//            })
//        });
//        //获取下拉列表等基础数据
////        for(var i in activeView.template.data){
////            if(activeView.template.data[i].type_select){
////                var xqlConfig = xgeeUtils.xql.parse(activeView.template.data[i].type_select.xql);
////                activeView.template.data[i].type_select.dataRef = xqlConfig.key;
////                $$Data[xqlConfig.cmd].query(xqlConfig.params,function(data){
////                    $scope[xqlConfig.key] =data;
////                })
////            }
////        }
//    }
//
//    function load() {
//
//    }
//
//    self.save = function (cfg) {
//        if ($("#" + cfg.alias + "Form").form('validate form')) {
//            $scope.item = eval("moduleData." + __resName + ".save(xgeeUtils.convertName($scope." + cfg.alias + ".item), $scope.$parent.refresh)");
//            $scope.$parent.currentItem = $scope.item;
//        }
//    }
//
//    return {
//        init: init,
//        load: load
//    }
}

function views_list_simple4($scope, $$Data) {

}

function views_query_simple4($scope, $$Data) {

}

function views_query_simple4($scope, $$Data) {

}