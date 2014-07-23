/**
 * Created by hongxq on 2014/7/19.
 */
;
var ViewBaseCtrl = Fiber.extend(function () {
    var viewState = {} //active,disabled,normal
    var varRmState = {}//readonly|modify
    return {

        alias: undefined,
        cfg: undefined,
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
;
function ui_design_index($scope, $state, $$Data) {

    $scope.ROOTV = "ROOTVROOTVROOTVROOTV";
    var viewCfgs = {
        byId: {},
        byAlias: {},
        byName: {}
    }

    var rootViewAlias = []

    var $alias$ = {};

    function init() {
        $scope.$parent.loadModulesMenu('ui');
        //TODO 取得
//        var cfgId = 'ui_design_main';
//
//        loadAndParseCfg({id: cfgId}, $scope, $$Data)
    }


    function loadAndParseCfg(params, $scope, $$Data, successFn) {
        console.debug(">>loadAndParseCfg > params >", params)
        if (!params)return;
        var cfg = viewCfgs.byId[params.id] || viewCfgs.byAlias[params.alias] || viewCfgs.byName[params.name];
        console.debug(">>loadAndParseCfg > cache cfg >", cfg)
        if (cfg) {
            //已存在则不再加载，只是重新渲染
            var isReParseAndRender = true;
            parseAndRender(cfg, isReParseAndRender);
            successFn(cfg)
        } else {
            if (params.id)
                ViewCfgLoader.byId(params.id, function (cfg) {
                    parseAndRender(cfg);
                    viewCfgs.byId[params.id] = cfg;
                    successFn(cfg)
                })
            else if (params.alias)
                ViewCfgLoader.byAlias(params.alias, function (cfg) {
                    parseAndRender(cfg);
                    viewCfgs.byAlias[params.alias] = cfg;
                    successFn(cfg)
                })
            else if (params.name)
                ViewCfgLoader.byNameFromFile(params.name, function (cfg) {
                    parseAndRender(cfg);
                    viewCfgs.byName[params.name] = cfg;
                    successFn(cfg)
                })
        }

        function parseAndRender(cfg) {
            ViewCfgHelper.parseAndBind(cfg)
        }
    }

    var ViewCfgLoader = {
        byId: function (id, successFn) {
            $$Data.entity.query({m: 'ui', e: 'viewCfg', id: id}, successFn)
        },
        byAlias: function (alias, successFn) {
            $$Data.jsonFile.get({dir: "ui/cfg", file: alias}, function (data) {
                console.debug(">>byAlias('" + alias + "'," + successFn + ") response:", data)
                successFn(data.cfg);
            })
        },
        //从文件中加载配置，基于文件名
        byNameFromFile: function (name, successFn) {
            $$Data.jsonFile.get({dir: "ui/cfg", file: name}, function (data) {
                console.debug(">>byNameFromFile('" + name + "',...) response:", data)
                successFn(data.cfg);
            })
        }
    }


    /**
     *
     * @param dir
     * @param name
     * @param alias
     * @param isConfigurable 是否启用配置功能，启用的话在加载的配置信息加需更有配置页面的信息
     */
//    function loadCfg(alias, callback, isConfigurable) {
//        //    $scope.index = genUrl($state.current.data);
//        //TODO  从服务器加载配置by $$stateProxy.state.current.data
//        //TODO remote
//
//        if (!resViewConfig[alias])console.info(">>resViewConfig[alias] is null,alias is ", alias)
//        resViewConfig[alias] ? callback(resViewConfig[alias]) : loadCfgByAlias(alias, callback);
//    }


    var ViewCfgHelper = {
        //        $scope.$alias$ = {}
        //        $scope.$alias$.$parentAlias = "";
        //        $scope.$alias$.$cfg = {}
        //        $scope.$alias$.$data = {}
        //        $scope.$alias$.$include = {layoutEast:"",layoutNorth:""};
        parseAndBind: function (cfg, isRedo) {
            if (!cfg.alias) {
                console.error(">>>cfg未配置alias,cfg:", cfg);
                return;
            }
            if ($scope[cfg.alias] & !isRedo) {
                console.error(">>>cfg已存在alias：", cfg.alias);
                return;
            }
            //各实例初始化变量示例
            $scope[cfg.alias] = {}
            $scope[cfg.alias].cfg = cfg;
            $scope[cfg.alias].params = {}//页面打开时输入的参数
            $scope[cfg.alias].data = {};
            $scope[cfg.alias].include = {};
            //alias map to parent alias
            if (cfg.views && angular.isArray(cfg.views))
                for (var i in cfg.views) {
                    ViewCfgHelper.parseAndBind(cfg.views[i], isRedo);
                    $scope[cfg.views[i].alias].parentAlias = cfg.alias
                }
        },
        clear: function (cfg) {
            if (!cfg.alias) {
                console.error(">>>cfg未配置alias,cfg:", cfg);
                return;
            }
            if ($scope[cfg.alias]) {
                console.debug(">>before delete $scope[cfg.alias]", $scope[cfg.alias])
                delete $scope[cfg.alias]
                console.debug(">>after delete $scope[cfg.alias]", $scope[cfg.alias])
            }
        },
        findCfgByAlias: function (alias, inCfg) {
            if (inCfg.alias == alias) {
                return inCfg;
            } else {
                for (var i in inCfg.views) {
                    var foundCfg = this.findCfgByAlias(alias, inCfg.views[i])
                    if (foundCfg)return foundCfg;
                }
                return {};
            }
        },
        findParentCfg: function (cfg) {
            var parentAlias = $scope[cfg.alias].parentAlias;
            return this.findCfgByAlias(parentAlias, cfg);
        },
        genId: function () {
            return Math.random() * 100000 + "_" + new Date().getMilliseconds()
        },
        genUrl: function (cfg) {
            //TODO 地址信息需提取出去
            var dir = cfg.dir ? cfg.dir + "/" : "";
            var ext = cfg.type ? ".html" : ".mustache?alias=" + cfg.alias;
            return "m/ui/design/" + dir + cfg.name + ext
        },
        /**
         * 渲染视图及子视图,创建相关controller
         * @param cfg
         * @param renderTo 一般用于指定根节点在特定的位置中进行展示
         * @param $scope
         * @param $$Data
         */
        renderAll: function (cfg, params, $scope, $$Data) {
            if (cfg) {
                var alias = cfg.alias
                $scope[alias].params = params;
                //加载页面模板
                includeViewByRenderTo(cfg, params ? params.renderTo : undefined);
                //加载页面配置数据
                //TODO window换成是所有views_xx_xx的owner
                var ctrl = undefined;
                if (window[cfg.name]) {

                    ctrl = eval("new " + cfg.name + "()")
                    $scope[alias].ctrl = ctrl;
                    ctrl.alias = alias;
                    ctrl.owner = $scope[alias];
                    ctrl.$scope = $scope[alias];
                    ctrl.$$Data = $scope[alias];
                    if (angular.isFunction(ctrl.afterInit)) {
                        ctrl.afterInit(cfg)
                    }
                } else {
                    console.warn(">>>未配置视图的同名函数:", cfg.name)
                }
//                console.debug(">>>renderAll cfg>>", cfg)
                loadData(cfg, $scope, $$Data);
                //递归render子视图
                if (cfg.views && angular.isArray(cfg.views))
                    for (var i in cfg.views) {
                        ViewCfgHelper.renderAll(cfg.views[i], null, $scope, $$Data)
                    }
            }
        }
    }


    function includeViewByRenderTo(cfg, forceRenderTo) {
        if (forceRenderTo)console.debug(">>forceRenderTo>" + forceRenderTo + "\r\n  cfg>", cfg)
        var renderTo = forceRenderTo || cfg.renderTo;
        var dotIndex = renderTo.indexOf(".");
        var alias = ""
        var subName = "";
        if (dotIndex == 0) {
            //格式：".xxx"，表示加载到parent的视图中
            alias = $scope[cfg.alias].parentAlias;
            subName = renderTo.substring(1)
        } else if (dotIndex > 0) {
            //格式：“alias.xxx”，表示加载到指定的视图中
            var rto = renderTo.split(".");
            alias = rto[0];
            subName = rto.length == 2 ? rto[1] : (rto.length == 3 ? rto[2] : console.error(">>>renderTo格式有误,应为xx | .xx | $alias$.xx | $alias$.include.xx>>", renderTo));

        } else {
            //格式："xxx"，表示加载到parent的视图中
            alias = $scope[cfg.alias].parentAlias;
            subName = renderTo;
        }
        //alias is false,that means, it's root cfg
        if (alias) {
            //TODO 怎么检查 renderTo的值和ng-include src中的值是否一致，不一致则throw error
            if (!$scope[alias].include.hasOwnProperty(subName)) {
                console.error("- ["+alias + ".include." + subName + "]不存在,请检查ng-include的src属性！");
            }
            if (forceRenderTo) {
                console.debug("- $scope[alias]>>", $scope[alias])
                angular.forEach($scope[alias], function (value, name) {
                    console.debug("- " + name + " >", value);
                })
            }

            $scope[alias].include[subName] = ViewCfgHelper.genUrl(cfg);

        } else {
//            console.debug("$scope[subName]>>",$scope.hasOwnProperty(subName))
            $scope[subName] = ViewCfgHelper.genUrl(cfg);
            console.debug("- $scope["+subName+"]=", ViewCfgHelper.genUrl(cfg))
//            console.debug(">>>include[" + subName + "]=" + ViewCfgHelper.genUrl(cfg));
        }

    }

    $scope.$designer = {
        toolbarUrl: "m/ui/design/view_design_toolbar.mustache",
        designable: true,
        saveCfg: function (id) {
            //
            $$Data.entity.ui.viewCfg.save()
        },
        enable: function (obj) {
            //console.debug(">>angular.element(this)>>",angular.element(this).parent().parent())
        },
        disable: function (obj) {

        },
        createView: function (id) {

        }
    };

    $scope.$modal = {}

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
                var dataItemCfg = cfg.data[i];
                //TODO 遍历所有的xql属性，查看是否为lazyLoad,否的话则即刻加载
                //(_isIgnoreLazyLoad?true:!dataItem.lazyLoad)&&
                console.debug(">>xqlBind toObject >", cfg.alias)
                $$Data.xqlBind({dataItemCfg: dataItemCfg, toObject: $scope[cfg.alias]});
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
    $scope.openViewX = function (srcAlias, targetAliasesStr, params) {
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
            //通过别名，查找找到需打开的（目标）viewCfg
            var targetCfg = ViewCfgHelper.findCfgByAlias(targetAlias, $scope[parentAlias].cfg);
            //TODO 传入参数
            openViewByCfg(targetCfg)
        }
    }

    /**
     * @param paramWrapper {id:"",name:"",alias:"",params:{}}
     */
    $scope.openView = function (paramsWrapper) {
        loadAndParseCfg(paramsWrapper, $scope, $$Data, function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);
        })
    }

    function openViewByCfg(cfg, params) {
        console.debug(">>openViewByCfg > renderAll >")
        console.debug("- cfg>", cfg);
        console.debug("- params>", params)
        ViewCfgHelper.renderAll(cfg, params, $scope, $$Data)
    }

//    $scope.openRefView = function (srcAlias, targetAlias, params) {
//        $scope[targetAlias] || loadCfg(targetAlias, initRefView);
//    }
//    function initRefView(cfg) {
//        refViewCfg[cfg.alias] = cfg
//        ViewCfgHelper.parseAndBind(cfg)
//        ViewCfgHelper.renderAll(cfg, $scope, $$Data);
//    }

    /**
     *
     * @param param
     */
    $scope.showModal = function (paramsWrapper) {
        loadAndParseCfg(paramsWrapper, $scope, $$Data, function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);
        })
        $("#rootModal").modal("show")
    }
    $scope.hideModal = function () {
        $("#rootModal").modal("hide")
    }


    init();

}
