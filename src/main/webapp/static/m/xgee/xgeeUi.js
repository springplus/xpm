/**
 * Created by hongxq on 2014/7/19.
 */
;var ViewBaseCtrl = Fiber.extend(function () {
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
;function ui_design_index($scope, $state, $$Data) {

    //在加载页面时进行初始化
    var mainViewCfg = {}
    //用于打开新的页面，在open事件触发时进行初始化
    var refViewCfg = {}

    var resViewConfig = {}

    function init() {
        $scope.$parent.loadModulesMenu('ui');
        //加载页面配置
        loadCfg('ui_design_main',function(cfg){
            mainViewCfg = cfg;
            ViewCfgHelper.parseAndBind(mainViewCfg)
            ViewCfgHelper.renderAll(mainViewCfg, $scope, $$Data)
        })
    }


    function loadCfgByAlias(alias,successCallback){
        $$Data.jsonFile.get({dir:"ui",file:alias},function(data){
            console.debug(">>loadCfgByAlias('"+alias+"',"+successCallback+") response:",data)
            successCallback(data.cfg);
        })
    }

    /**
     *
     * @param dir
     * @param name
     * @param alias
     * @param isConfigurable 是否启用配置功能，启用的话在加载的配置信息加需更有配置页面的信息
     */
    function loadCfg(alias,callback, isConfigurable) {
        //    $scope.index = genUrl($state.current.data);
        //TODO  从服务器加载配置by $$stateProxy.state.current.data
        //TODO remote

        if(!resViewConfig[alias])console.info(">>resViewConfig[alias] is null,alias is ",alias)
        resViewConfig[alias]?callback(resViewConfig[alias]):loadCfgByAlias(alias,callback);
    }


    var ViewCfgHelper = {
        //        $scope.$alias$ = {}
        //        $scope.$alias$.$parentAlias = "";
        //        $scope.$alias$.$cfg = {}
        //        $scope.$alias$.$include = {layoutEast:"",layoutNorth:""};
        parseAndBind: function (cfg) {
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
                    ViewCfgHelper.parseAndBind(cfg.views[i]);
                    $scope[cfg.views[i].alias].parentAlias = cfg.alias
                }
        },
        findCfgByAlias: function findCfg(alias, inCfg) {
            if (inCfg.alias == alias) {
                return inCfg;
            } else {
                for (var i in inCfg.views) {
                    var foundCfg = findCfg(alias, inCfg.views[i])
                    if (foundCfg)return foundCfg;
                }
                return {};
            }
        },
        findParentCfg: function (cfg) {
            var parentAlias = $scope[cfg.alias].parentAlias;
            return findCfg(parentAlias, cfg);
        },
        genId:function () {
            return Math.random() * 100000 + "_" + new Date().getMilliseconds()
        },
        genUrl:function (cfg) {
            //TODO 地址信息需提取出去
            var dir = cfg.dir ? cfg.dir + "/" : "";
            var ext = cfg.type ? ".html" : ".mustache?alias=" + cfg.alias;
            return "m/ui/design/" + dir + cfg.name + ext
        },
        /**
         * 渲染视图及子视图
         * @param cfg
         * @param $scope
         * @param $$Data
         */
        renderAll:function(cfg, $scope, $$Data) {
            if (cfg) {
                var alias = cfg.alias
                //加载页面模板
                includeViewByRenderTo(cfg);
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
                        ViewCfgHelper.renderAll(cfg.views[i], $scope, $$Data)
                    }
            }
        }


    }

    function includeViewByRenderTo(cfg) {
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
            $scope[alias].include[subName] = ViewCfgHelper.genUrl(cfg);

        } else {
//            console.debug("$scope[subName]>>",$scope.hasOwnProperty(subName))
            $scope[subName] = ViewCfgHelper.genUrl(cfg);
//            console.debug(">>>include[" + subName + "]=" + ViewCfgHelper.genUrl(cfg));
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
//        for (var i in mainViewCfg.views) {
//            if ($scope.cfg.views[i].alias == srcAliasStr) {
//                var targetView = $scope.cfg.views[i]
//                //TODO 改成changedAliasStr
//                targetView.alias = "views_query_simple"
//                targetView.name = "views_query_simple"
//                $scope[targetView.renderTo] = ViewCfgHelper.genUrl(targetView)
//                break;
//            }
//        }
//    }
    /**
     * 前提：目标cfg已加载、解析
     * 依据配置更换include src的值，实现页面的切换
     * @param srcAliasStr
     * @param targetAliasesStr alias,alias,alias... 可同时打开多个目标view
     */
    $scope.openView = function (srcAlias, targetAliasesStr, params) {
        //active
        //disable
        //
        //如果viewConfig不存在，则从远程加载；若远程也不存在则报错。



        console.debug(">>>srcAlias:" + srcAlias + ">>>targetAliasesStr:" + targetAliasesStr + ">>>params", params)
        var targetAliases = targetAliasesStr.split(",")
        for (var i in targetAliases) {
            var targetAlias = targetAliases[i];
            //如果target有无点号，则取当前srcAlias下的view,否则按点号按层进行解析
            var namespaces = targetAlias.split(".");
            if (namespaces.length <= 2) {
                var parentAlias = srcAlias;
                var targetAlias = namespaces[0];
                if (namespaces.length == 2) {
                    parentAlias = namespaces[0];
                    targetAlias = namespaces[1];
                }
            } else {
                console.error("target:" + targetAliasesStr + "格式不正确，应为alias,alias,alias...每个alias的格式为：parentAlias.alias或alias。")
            }
            //通过别名，查找找到目标viewCfg
            var targetCfg = ViewCfgHelper.findCfgByAlias(targetAlias, $scope[parentAlias].cfg);
            includeViewByRenderTo(targetCfg);
            //传递参数
            //TODO 这里的item需改成配置的方式
            $scope[targetCfg.alias].item = params.item;
        }
    }
    $scope.openRefView = function (srcAlias, targetAlias,param) {
        $scope[targetAlias]||loadCfg(targetAlias,initRefView);
    }
    function initRefView(cfg){
        refViewCfg[cfg.alias] = cfg
        ViewCfgHelper.parseAndBind(cfg)
        ViewCfgHelper.renderAll(cfg,$scope,$$Data);
    }


    $scope.showModal = function (param) {
        if (angular.isObject(param)) {
            //如果是当前页面，不更改，直接showModal
            var src = ViewCfgHelper.genUrl({alias: param.alias, name: param.alias});
            if (src == $scope.baseModal)
                $("#baseModal").modal("show")
            else
                $scope.baseModal = src;
        } else {
            $("#baseModal").modal("show")
        }
    }
    $scope.hideModal = function(){
        $("#baseModal").modal("hide")
    }

    init();

}
