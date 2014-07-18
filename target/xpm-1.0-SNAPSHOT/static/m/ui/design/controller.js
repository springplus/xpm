/**
 * Created by hongxueqian on 14-7-11.
 *
 * $scope.$alias$.include
 * $scope.$alias$.include
 */
function ui_design_index($scope, $state, $$Data) {

    var viewInstance = {}

    var parser = new Parser();

    function init() {
        $scope.$parent.loadModulesMenu('ui');
        //加载页面配置
        console.debug(">>$scope['alias']>>",$scope["alias"]);
//        viewInstance = resViewConfig["baseView"];
        viewInstance = resViewConfig["ui_design_main"];
        parser.parseAndBind(viewInstance)
    }

    /**
     * $scope
     * @returns {{parse: parse}}
     * @constructor
     */
    function Parser() {
//        $scope.$alias$ = {}
//        $scope.$alias$.$parentAlias = "";
//        $scope.$alias$.$cfg = {}
//        $scope.$alias$.$include = {layoutEast:"",layoutNorth:""};
        function parse(cfg) {
            bind(cfg);
        }

        function bind(cfg) {
//            console.debug(">>>bind>>",cfg)
            if (!cfg.alias) {
                console.error(">>>cfg未配置alias,cfg:", cfg);
                return;
            }
            if ($scope[cfg.alias]) {
                console.error(">>>cfg已存在alias：", cfg.alias);
                return;
            }
            //各实例初始化变量示例
            $scope[cfg.alias] = {}
            $scope[cfg.alias].cfg = cfg;
            $scope[cfg.alias].include = {};
            //alias map to parent alias
            if (cfg.views && angular.isArray(cfg.views))
                for (var i in cfg.views) {
                    bind(cfg.views[i]);
                    $scope[cfg.views[i].alias].parentAlias = cfg.alias
                }
        }

        function findCfg(alias, inCfg) {
            if (inCfg.alias == alias) {
                return inCfg;
            } else {
                for (var i in inCfg.views) {
                    var foundCfg = findCfg(alias, inCfg.views[i])
                    if (foundCfg)return foundCfg;
                }
                return {};
            }
        }

        function findParentCfg(cfg) {
            var parentAlias = $scope[cfg.alias].parentAlias;
            return findCfg(parentAlias, cfg);
        }

        return {
            parseAndBind: parse,
            findCfgByAlias:findCfg
        }
    }


//    $scope.index = url($state.current.data);
    //TODO  从服务器加载配置by $$stateProxy.state.current.data


    function id() {
        return Math.random() * 100000 + "_" + new Date().getMilliseconds()
    }

    function url(cfg) {
        var dir = cfg.dir ? cfg.dir + "/" : "";
        var ext = cfg.type ? ".html" : ".mustache?alias=" + cfg.alias;
        return "m/ui/design/" + dir + cfg.name + ext
    }


    function includeViewBy(cfg) {
        var dotIndex = cfg.renderTo.indexOf(".");
        var alias = ""
        var subName = "";
        if (dotIndex == 0) {
            //格式：".xxx"，表示加载到parent的视图中
            alias = $scope[cfg.alias].parentAlias;
            subName = cfg.renderTo.substring(1)
        } else if (dotIndex > 0) {
            //格式：“alias.xxx”，表示加载到指定的视图中
            var rto = cfg.renderTo.split(".");
            alias = rto[0];
            subName = [rto[1]];
        } else {
            //格式："xxx"，表示加载到parent的视图中
            alias = $scope[cfg.alias].parentAlias;
            subName = cfg.renderTo;
        }
        //alias is false,that means, it's root cfg
        if (alias) {
//            console.debug("$scope[alias].include[subName]>>",$scope[alias].include.hasOwnProperty(subName))
            //TODO 怎么检查 renderTo的值和ng-include src中的值是否一致，不一致则throw error
//            if (!$scope[alias].include.hasOwnProperty(subName)) {
//                console.error("["+alias + ".include." + subName + "]不存在,请检查ng-include的src属性！");
//            }
            $scope[alias].include[subName] = url(cfg);

        } else {
//            console.debug("$scope[subName]>>",$scope.hasOwnProperty(subName))
            $scope[subName] = url(cfg);
//            console.debug(">>>include[" + subName + "]=" + url(cfg));
        }

    }


    /**
     * 刷新指定视图
     * @param alias 视图别名
     * @param deep 或deep>0则刷新相应deep的子视图，若为<=0或undefined,则只刷新当前视图
     */
    function refresh(alias, deep) {
        //load data from remote
        //加载当前视图及子视图中没有lazyLoad的data

        //bind v to m
        //set view state

        //set view security

        //trigger event to other view
        //--refresh other view
        //--
    }

    /**
     * 渲染视图及子视图
     * @param cfg
     * @param $scope
     * @param $$Data
     */
    function renderAll(cfg, $scope, $$Data) {
        if (cfg) {
            var alias = cfg.alias
            //加载页面模板
            includeViewBy(cfg);
            //加载页面配置数据

            //

            //TODO window换成是所有views_xx_xx的owner
            var ctrl = undefined;
            if (window[cfg.name]) {
                ctrl = eval("new " + cfg.name + "()")
                $scope[alias].ctrl = ctrl;
                ctrl.owner = $scope[alias];
                ctrl.$scope = $scope[alias];
                ctrl.$$Data = $scope[alias];
                if (angular.isFunction(ctrl.afterInit)) {
                    ctrl.afterInit(cfg)
                }
            } else {
                console.warn(">>>未配置视图的同名函数:", cfg.name)
            }
            console.debug(">>>cfg>>", cfg)
            loadData(cfg, $scope, $$Data);

//            if (ctrl) {
//                $scope[alias].ctrl = ctrl;
//                if (angular.isFunction(ctrl.init))
//                    ctrl.init($scope[alias]);
//                loadData(cfg, $scope, $$Data);
//                if (angular.isFunction(ctrl.load))
//                    ctrl.load();
//            }
            //递归render子视图
            if (cfg.views && angular.isArray(cfg.views))
                for (var i in cfg.views) {
                    renderAll(cfg.views[i], $scope, $$Data)
                }
        }
    }

    //渲染当前视图，不包括子视图
    function renderLazyView(cfg, $scope, $$Data) {

    }

    /**
     * 加载当前视图的数据，不加载子视图数据
     * @param cfg
     * @param $scope
     * @param $$Data
     * @Param isIgnoreLazyLoad true:不考虑lazyload属性，强行进行加载
     */
    function loadData(cfg, $scope, $$Data) {
        var alias = cfg.alias
//        var _isIgnoreLazyLoad = isIgnoreLazyLoad?true:false;
        if (cfg.data) {
            for (var i in cfg.data) {
                var dataItem = cfg.data[i];
                //TODO 遍历所有的xql属性，查看是否为lazyLoad,否的话则即刻加载
                //(_isIgnoreLazyLoad?true:!dataItem.lazyLoad)&&
                if (dataItem.xql) {
                    var xqlConfig = xgeeUtils.xql.parse(dataItem.xql);
                    //TODO 同一个KEY 存在不同参数的情况
                    var bindTo = dataItem.bindTo ? dataItem.bindTo : xqlConfig.key;
                    //TODO 待改成remote获取
                    var appForm = null;
                    //TODO 实现form的$$Data.query
                    if (xqlConfig.cmd == "form" || xqlConfig.cmd == "entity")
                        $scope[alias][bindTo] = appForm
                    else
                        $scope[alias][bindTo] = $$Data[xqlConfig.cmd].query(xqlConfig.params)
//                    console.debug(">>>xqlConfig.cmd>>>", xqlConfig.cmd == "form" || xqlConfig.cmd == "entity")
                }
            }
        }
    }


    /**
     *
     * @param targetAliases alias,alias,alias
     */
    $scope.onAction = function (srcAliasStr, action) {
        console.debug(">>>action[" + action.name + "] from " + srcAliasStr);
        //TODO 可以考虑在这里做一些通用的操作，这样就可以简化各方法内的操作
        $scope[srcAliasStr].ctrl[action.name].apply($scope[srcAliasStr].ctrl, [action])
    }
//    $scope.configView = function (srcAliasStr, changedAliasStr) {
//        //TODO 从配置页面中获取配置的信息
//        for (var i in viewInstance.views) {
//            if ($scope.cfg.views[i].alias == srcAliasStr) {
//                var targetView = $scope.cfg.views[i]
//                //TODO 改成changedAliasStr
//                targetView.alias = "views_query_simple"
//                targetView.name = "views_query_simple"
//                $scope[targetView.renderTo] = url(targetView)
//                break;
//            }
//        }
//    }
    /**
     * @param srcAliasStr
     * @param targetAliasesStr alias,alias,alias...
     */
    $scope.openView = function (srcAliasStr, targetAliasesStr, params) {
        console.debug(">>>srcAliasStr:" + srcAliasStr + ">>>targetAliasesStr:" + targetAliasesStr + ">>>params", params)
        var targetAliases = targetAliasesStr.split(",")
        for (var i in targetAliases) {
            var targetAlias = targetAliases[i];
            //如果target有无点号，则取当前srcAliasStr下的view,否则按点号按层进行解析
            var namespaces = targetAlias.split(".");
            if (namespaces.length <= 2) {
                var parentAlias = srcAliasStr;
                var targetAlias = namespaces[0];
                if (namespaces.length == 2) {
                    parentAlias = namespaces[0];
                    targetAlias = namespaces[1];
                }
            } else {
                console.error("target:" + targetAliasesStr + "格式不正确，应为alias,alias,alias...每个alias的格式为：parentAlias.alias或alias。")
            }
            //通过别名，查找找到目标view
            var targetCfg = parser.findCfgByAlias(targetAlias,$scope[parentAlias].cfg);
            includeViewBy(targetCfg);
            //传递参数
            //TODO 这里的item需改成配置的方式
            $scope[targetCfg.alias].item = params.item;
        }
    }

    $scope.includeAndShowModal = function (param) {
        //如果是当前页面，不更改，直接showModal
        var src = url({alias: param.alias, name: param.alias});
        if (src == $scope.baseModal)
            $scope.showModal(param.alias);
        else
            $scope.baseModal = src;
    }

    $scope.showModal = function (alias) {
        $("#baseModal").modal("show")
    }


    init();
    renderAll(viewInstance, $scope, $$Data)
}

var appForm = [
    {
        displayName: "应用名称",
        identifier: 'name',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "应用编码",
        identifier: 'code',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "链接",
        identifier: 'href',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "图标",
        identifier: 'icon',
        rules: [
            {type: 'empty', prompt: '不允许为空'}
        ]
    },
    {
        displayName: "描述",
        identifier: 'description',
        type: {name: "textarea"}
    }
]

// Animal base class
var ViewBaseCtrl = Fiber.extend(function () {
    var viewState = {} //active,disabled,normal
    var varRmState = {}//readonly|modify
    return {
        owner: undefined,
        $scope: undefined,
        $$Data: undefined,
        // The `init` method serves as the constructor.
        init: function () {
            // Private
//            function private1(){}
//            function private2(){}
            // Privileged
        }

        // Public
    }
});

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