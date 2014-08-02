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
function ui_design_index($scope, $state, $$Data, $stateParams) {

    var vo;
    console.debug(">>ui_design_index.. $stateParams > ", $stateParams)

    var Settings = {
        rootSrc: "rootIndex"
    }

    var ViewCfgs = (function () {
        var count = {
            byId: 0,
            byName: 0,
            byAlias: 0
        }
        var values = {
            byId: {},//kye:id,value:cfg
            byName: {},//key:name,value:cfg
            byAlias: {}//key:alias:value:cfg
        }
        var rootAlias = "",rootId = ""
        return {
            set: function (by,key,cfg) {
                //---set count
                count[by]++;
                if (count.byId == 1) {
                    rootId = key;
                }
                //--set values
                values[by][key] = cfg;
            },
            //TODO deep get in cfg
            findInAllByAlias: function (alias) {
                var get = function (alias, by) {
                    var cfgs = values[by];
                    for (var i in cfgs) {
                        if (alias == cfgs[i].alias) {
                            return cfgs[i];
                        }
                    }
                }
                return get(alias, "byId") || get(alias, "byName") || get(alias, "byAlias")
            },
            clear: function (alias) {
                var deleteByAlias = function (alias, by) {
                    var cfgs = values[by];
                    for (var i in cfgs) {
                        if (alias == cfgs[i].alias) {
                            delete cfgs[i]
                            count[by]--;
                            return true;
                        }
                    }
                    return false;
                }
                deleteByAlias(alias, "byId") || deleteByAlias(alias, "byName") || deleteByAlias(alias, "byAlias")
            },
            count: function () {
                return count.byId + count.byName + count.byAlias
            },
            rootAlias: rootAlias,
            rootId: function () {
                return rootId
            },
            values: function () {
                return values;
            },
            byId: function (id) {
                return values.byId[id];
            },
            byName: function (name) {
                return values.byName[name];
            },
            byAlias: function (alias) {
                return values.byAlias[alias];
            }
        }
    })()
    $scope.viewCfgs = ViewCfgs


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
        var cfg = ViewCfgs.byId(params.id) || ViewCfgs.byAlias(params.alias) || ViewCfgs.byName(params.name);
        console.debug(">>loadAndParseCfg > cache cfg >", cfg)

        var ViewCfgLoader = {
            byId: function (id, successFn) {
                $$Data.entity.query({m: 'ui', e: 'viewCfg', id: id}, successFn)
            },
            byAlias: function (alias, successFn) {

                //
                var foundCfg = ViewCfgs.findInAllByAlias(alias);
//            if (ViewCfgs) {
//                for (var by in ViewCfgs) {
//                    var cfgs = ViewCfgs[by];
//                    if (cfgs && !foundCfg) {
//                        for (var i in cfgs) {
//                            var cfg = cfgs[i]
//                            foundCfg = ViewCfgHelper.findCfgByAlias(alias, cfg);
//                            if (foundCfg)break;
//                        }
//                    }
//                    if (foundCfg)break;
//                }
//            }
                console.debug(">>byAlias('" + alias + "'," + successFn + ") response:", foundCfg)
                successFn(foundCfg);
                //TODO 改成内存中获取
//            $$Data.jsonFile.get({dir: "ui/cfg", file: alias}, function (data) {
//
//            })
            },
            //从文件中加载配置，基于文件名
            byName: function (name, successFn) {
                $$Data.jsonFile.get({dir: "ui/" + name, file: "define"}, function (data) {
                    console.debug(">>byName('" + name + "',...) response:", data)
                    successFn(data.cfg);
                })
            }
        }

        if (cfg) {
            //已存在则不再加载，只是重新渲染
            var isReParseAndRender = true;
            var reAliasCfg = parse(cfg, isReParseAndRender);
            //清除已有的配置 TODO
//            removeCfgByAlias(cfg.alias);
            successFn(reAliasCfg)
        } else {
            if (params.id)
                ViewCfgLoader.byId(params.id, function (cfg) {
                    var reAliasCfg = parse(cfg);
                    ViewCfgs.set("byId",params.id,reAliasCfg);
//                    removeCfgByAlias(cfg.alias);
                    successFn(reAliasCfg)
                })
            else if (params.alias)
                ViewCfgLoader.byAlias(params.alias, function (cfg) {
                    var reAliasCfg = parse(cfg);
                    ViewCfgs.set( "byAlias",params.alias,reAliasCfg);
                    successFn(reAliasCfg)
                })
            else if (params.name)
                ViewCfgLoader.byName(params.name, function (cfg) {
                    var reAliasCfg = parse(cfg);
                    ViewCfgs.set( "byName",params.name,reAliasCfg);
//                    removeCfgByAlias(cfg.alias);
                    successFn(reAliasCfg)
                })
        }

        function removeCfgByAlias(alias) {
            ViewCfgHelper.unBindAndClear(alias)
            ViewCfgs.clear(alias)
        }

        function parse(cfg) {
            var reAliasCfg = ViewCfgHelper.reAlias(cfg);
            ViewCfgHelper.parseAndBind(reAliasCfg)
            return reAliasCfg;
        }


    }


    var ViewCfgHelper = {
        parseAndBind: function (cfg, isRedo) {
            if (!cfg.alias) {
                console.error(">>cfg未配置alias,cfg:", cfg);
                return;
            }
            if ($scope[cfg.alias] & !isRedo) {
                console.error(">>cfg已存在alias：", cfg.alias);
                return;
            }
            //各实例初始化变量示例
            $scope[cfg.alias] = {}
            $scope[cfg.alias].params = {}//页面打开时输入的参数 //TODO 改为VO
            $scope[cfg.alias].data = {};

            //--TODO 这几个信息应存在ViewCfgs中
            $scope[cfg.alias].cfg = cfg;
            $scope[cfg.alias].include = {}; //{layoutEast:"",layoutNorth:""};
            $scope[cfg.alias].childAliases = [];
            $scope[cfg.alias].parentAlias = "";
            //alias map to parent alias
            if (cfg.views && angular.isArray(cfg.views))
                for (var i in cfg.views) {
                    ViewCfgHelper.parseAndBind(cfg.views[i], isRedo);
                    $scope[cfg.views[i].alias].parentAlias = cfg.alias
                }
        },
        unBindAndClear: function (alias) {
            if (alias && $scope[alias]) {
                console.debug(">>before delete $scope[alias]", $scope[alias])
                delete $scope[alias]
                console.debug(">>after delete $scope[alias]", $scope[alias])
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
        aliasIndex: 1,
        genId: function (salt) {
            Math.round(10)
            salt = salt || "id"
            //return salt + "_" + new Date().getMilliseconds()
            return salt + "_" + this.aliasIndex++
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
        renderAll: function (cfg, params, $scope, $$Data, onSrcChanged) {
            if (cfg) {
                var alias = cfg.alias
                console.debug(">> alias > ", alias)
                $scope[alias].params = params;
                //加载页面模板
                var renderTo = params ? params["renderTo"] : undefined;
                var renderToAlias = includeViewByRenderTo(cfg, renderTo, onSrcChanged);
                //--set rootAlias
                if(renderTo==Settings.rootSrc)ViewCfgs.rootAlias=cfg.alias;
                //建立上下级关系
                console.debug("- (!$scope[renderToAlias].childAliases)", (!$scope[renderToAlias].childAliases))
                if ($scope[renderToAlias].childAliases) {
                    for (var i in $scope[renderToAlias].childAliases) {
                        if (cfg.alias != $scope[renderToAlias].childAliases[i]) {
                            $scope[renderToAlias].childAliases.push(cfg.alias)
                        }
                    }
                } else {
                    $scope[renderToAlias].childAliases = [alias];
                    console.debug("--------childAliases:", $scope[renderToAlias])
                }
                //TODO 删除include替换掉的view
                //                    removeCfgByAlias(cfg.alias);

                console.debug("- map child:[" + cfg.alias + "] to parent:", renderToAlias)
                console.debug("-        childAliases:", $scope[renderToAlias].childAliases)

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
        },
        /**
         * 自动生成alias，取代cfg中默认的alias,确保引用同一个view不冲突
         * @param cfg
         * @returns {*}
         */
        reAlias: function (cfg) {
            var aliases = []

            function regenAlias(cfg) {
                if (cfg) {
                    aliases.push(cfg.alias);
                    if (cfg.views)
                        for (var i in cfg.views) {
                            regenAlias(cfg.views[i])
                        }
                }
            }

            regenAlias(cfg);
//            console.debug(">>aliases>",aliases)
            //TODO 改成按属性遍历的实现方式，以免出现关键字替换出错
            var cfgStr = JSON.stringify(cfg);
            //替换alias
            if (angular.isArray(aliases)) {
                for (var i in aliases) {
                    var alias = aliases[i];
                    var newAlias = ViewCfgHelper.genId("alias");
                    var newAliasMode1 = '"' + newAlias + '.';
                    var newAliasMode2 = '"alias":"' + newAlias + '"';
//                    console.debug("  newAlias>",newAlias)
                    cfgStr = eval('cfgStr.replace(/"' + alias + '\\./g, newAliasMode1)');
                    cfgStr = eval('cfgStr.replace(/"alias":"' + alias + '"/g, newAliasMode2)');
                }
            }
            console.debug("  reAlias后的结果>", cfgStr)
            cfg = JSON.parse(cfgStr);
            console.debug("  reAlias后的结果>", cfg)
            return cfg;
        }
    }


    /**
     *
     * @param cfg
     * @param forceRenderTo
     * @param onSrcChanged
     * @returns {string} alias 空表示根|其它具体的视图别名
     */
    function includeViewByRenderTo(cfg, forceRenderTo, onSrcChanged) {
        if (forceRenderTo)console.debug(">>forceRenderTo>" + forceRenderTo + "\r\n  cfg>", cfg)
        var renderTo = forceRenderTo || cfg.renderTo;
        var dotIndex = renderTo.indexOf(".");
        var renderToAlias = ""
        var subName = "";
        if (dotIndex == 0) {
            //格式：".xxx"，表示加载到parent的视图中
            renderToAlias = $scope[cfg.alias].parentAlias;
            subName = renderTo.substring(1)
        } else if (dotIndex > 0) {
            //格式：“alias.xxx”，表示加载到指定的视图中
            var rto = renderTo.split(".");
            renderToAlias = rto[0];
            subName = rto.length == 2 ? rto[1] : (rto.length == 3 ? rto[2] : console.error(">>>renderTo格式有误,应为xx | .xx | $alias$.xx | $alias$.include.xx>>", renderTo));

        } else {
            //格式："xxx"，表示加载到parent的视图中
            renderToAlias = $scope[cfg.alias].parentAlias;
            subName = renderTo;
        }
        //renderToAlias is false,that means, it's root cfg
        if (renderToAlias) {
            //TODO 怎么检查 renderTo的值和ng-include src中的值是否一致，不一致则throw error
//            if (!$scope[alias].include.hasOwnProperty(subName)) {
//                console.error("- ["+renderToAlias + ".include." + subName + "]不存在,请检查ng-include的src属性！");
//            }
            if (forceRenderTo) {
                console.debug("- $scope[renderToAlias]>>", $scope[renderToAlias])
                angular.forEach($scope[renderToAlias], function (value, name) {
                    console.debug("- " + name + " >", value);
                })
            }

            var newSrc = ViewCfgHelper.genUrl(cfg);
            if (angular.isFunction(onSrcChanged)) {
                onSrcChanged($scope[renderToAlias].include[subName], newSrc)
            }
            $scope[renderToAlias].include[subName] = newSrc;
        } else {
//            console.debug("$scope[subName]>>",$scope.hasOwnProperty(subName))
            var newSrc = ViewCfgHelper.genUrl(cfg);
            if (angular.isFunction(onSrcChanged)) {
                onSrcChanged($scope[subName], newSrc)
            }
            $scope[subName] = newSrc;
            console.debug("- $scope[" + subName + "]=", newSrc)
//            console.debug(">>>include[" + subName + "]=" + ViewCfgHelper.genUrl(cfg));
        }
        return renderToAlias || subName;
    }

    $scope.$designer = {
        toolbarUrl: "m/ui/design/view_design_toolbar.mustache",
        designable: $stateParams.designable,
        ignoreViewsToSave:["views_design_select","views_json_editor"],
        getFullCfg: function () {

        },
        saveCfg: function () {
            var cfgs = {
                values: ViewCfgs.values(),
                count: ViewCfgs.count(),
                rootAlias: ViewCfgs.rootAlias,
                rootId: ViewCfgs.rootId()
            }
//            $scope.$designer.ignoreViewsToSave
            console.debug(">> saveCfg > ", cfgs)
            //$$Data.entity.ui.viewCfg.save()
        },
        enable: function (obj) {
            console.debug(">>angular.element(this)>>", this)
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
     * @param paramWrapper {id:"",name:"",alias:"",params:{renderTo:"",item:""}}
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

    function setRootViewCfg(cfg, params) {
        if (params.renderTo == "rootIndex") {

        }
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
        console.debug("showModal")
        loadAndParseCfg(paramsWrapper, $scope, $$Data, function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);

        })
        //TODO 需检查在新增加时需show两次，若是地址没有变，页面中的onLoad可能没加载
        $("#rootModal").modal("show").modal("hide dimmer")
    }
    $scope.hideModal = function () {
        $("#rootModal").modal("hide")
    }


    $scope.showJSONEditor = function (json) {
//
//        var aliases = [];
//        for(var i in ViewCfgs){
//            for(var cfgIndex in ViewCfgs[i]){
//                aliases.push($scope[ViewCfgs[i][cfgIndex].alias].childAliases)
//            }
//        }
        new JSONEditor(document.getElementById('jsonEditor'), {mode: 'view'}, json);
    }
    init();

}
