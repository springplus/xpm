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
function ui_design_index($scope, $stateParams, $$Data) {

    var vo;

    var Settings = {
        rootSrc: "rootIndex"
    }

    var ViewCfgs = (function () {
        var index = 0;
        var count = {
            byId: 0,
            byName: 0,
            byAlias: 0
        }
        var aliasMap = {},
            rootAlias = "",
            rootId = "",
            ignoreViewsToSave = {"views_design_select": true};
        return {
            set: function (by, key, cfg) {
                if (ignoreViewsToSave[cfg.name])return;
                index++;
                //---set count
                count[by]++;
                if (count.byId == 1) {
                    rootId = key;
                }
                //--set values
//                values[by][key] = cfg;
                aliasMap[cfg.alias] = {sn: index, by: by, key: key, value: cfg}
            },
            getAll: function () {
                return aliasMap;
            },
            //TODO deep get in cfg
            findOne: function (alias) {
                aliasMap[alias];
            },
            clear: function (alias) {
                //TODO 删除子view
                if (aliasMap[alias]) {
                    count[aliasMap[alias].by]--
                    delete aliasMap[alias];
                }
            },
            count: function () {
                return count.byId + count.byName + count.byAlias
            },
            rootAlias: rootAlias,
            rootId: rootId
        }
    })()
    $scope.viewCfgs = ViewCfgs

    var RenderHistory = (function () {
        var renderInfoAry = []
        return {
            push: function (renderInfo) {
                renderInfoAry.push(renderInfo)
            },
            //查找同一个parent alias，同一个include的上一个renderInfo
            findPrev: function (renderInfo) {
                if (renderInfoAry.length > 0) {
                    for (var i = renderInfoAry.length - 1; i > 0; i--) {
                        var info = renderInfoAry[i];
                        if (info.renderToAlias == renderInfo.renderToAlias && info.include == renderInfo.include && info.newUrl == renderInfo.oldUrl && info.id != renderInfo.id) {
                            return info;
                        }
                    }
                }
                return undefined;
            }
        }
    })()

    var $alias$ = {};

    function init() {
        $scope.$parent.loadModulesMenu('ui');
        loadAndParseCfg({id: $stateParams.id}, function (cfg) {
            console.debug("- initLoadAndParse callback cfg>", cfg)
            openViewByCfg(cfg);
        })
        ViewCfgs.rootId = $stateParams.id;
    }

    var ViewCfgLoader = {
        //从服务端加载
        byId: function (id, successFn) {
            $$Data.entity("ui.viewCfg").get({id: id}, successFn)
        },
        //从内存中获取
        byAlias: function (alias, successFn) {
            successFn(ViewCfgs.findOne(alias));
        },
        //从文件中加载配置，基于文件名
        byName: function (name, successFn) {
            $$Data.jsonFile.get({dir: "ui/" + name, file: "define"}, function (data) {
                console.debug(">>byName('" + name + "',...) response:", data)
                successFn(data.cfg);
            })
        }
    }

    function loadAndParseCfg(params, successFn) {
        console.debug(">>loadAndParseCfg > params >", params)
        if (!params)return;

        var cfg = null;
        if (cfg) {
            //已存在则不再加载，只是重新渲染
            var isReParseAndRender = true;
            var reAliasCfg = parse(cfg, isReParseAndRender);
            successFn(reAliasCfg)
        } else {
            if (params.id) {
                ViewCfgLoader.byId(params.id, function (data) {
                    var cfgs = {};
                    try {
                        cfgs = JSON.parse(data.content);
                    } catch (e) {
                        console.error(">>解析JSON配置信息data.content出错。\r\n- data.content:",data.content)
                    }
                    if (cfgs) {
                        for (var i in cfgs) {
                            //view order TODO
                            var reAliasCfg = parse(cfgs[i].value);
                            ViewCfgs.set("byAlias", reAliasCfg.alias, reAliasCfg);
                            successFn(reAliasCfg)
                        }
                    }

                })
            }
            else if (params.alias)
                ViewCfgLoader.byAlias(params.alias, function (cfg) {
                    var reAliasCfg = parse(cfg);
                    ViewCfgs.set("byAlias", params.alias, reAliasCfg);
                    successFn(reAliasCfg)
                })
            else if (params.name)
                ViewCfgLoader.byName(params.name, function (cfg) {
                    var reAliasCfg = parse(cfg);
                    ViewCfgs.set("byName", params.name, reAliasCfg);
                    successFn(reAliasCfg)
                })
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
                delete $scope[alias]
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
        //
        parseUrl: function (cfg) {
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
            var self = this;
            if (cfg) {
                var alias = cfg.alias
                $scope[alias].params = params || {};
                //加载页面模板
                var renderInfo = renderOne(cfg);
                RenderHistory.push(renderInfo);
                console.debug("-    render cfg>", cfg)
                console.debug("-    renderInfo>", renderInfo)
                //--delete old view
                var prevRenderInfo = RenderHistory.findPrev(renderInfo);
                console.debug("- prevRenderInfo>", prevRenderInfo)
                if (prevRenderInfo)removeOneByAlias(prevRenderInfo.alias);
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
                    console.warn("- 未配置视图的同名函数:", cfg.name)
                }
//                console.debug(">>>renderAll cfg>>", cfg)
                loadData(cfg, $scope, $$Data);
                //递归render子视图
                if (cfg.views && angular.isArray(cfg.views))
                    for (var i in cfg.views) {
                        ViewCfgHelper.renderAll(cfg.views[i], null, $scope, $$Data)
                    }
            }
            function renderOne(cfg) {
                var renderInfo = self.parseRenderTo(cfg);
                var renderToAlias = renderInfo.renderToAlias;
                //--set rootAlias
                if (cfg.renderTo == Settings.rootSrc)ViewCfgs.rootAlias = cfg.alias;
                //--set include src
                //renderToAlias is false,that means, it's root cfg
                if (renderToAlias) {
                    renderInfo.oldUrl = $scope[renderToAlias].include[renderInfo.include];
                    $scope[renderToAlias].include[renderInfo.include] = renderInfo.newUrl;
                } else {
                    renderInfo.oldUrl = $scope[renderInfo.include];
                    $scope[renderInfo.include] = renderInfo.newUrl;
                }
                //建立上下级关系
//                console.debug("- (!$scope[renderToAlias].childAliases)", (!$scope[renderToAlias].childAliases))
//                if ($scope[renderToAlias].childAliases) {
//                    for (var i in $scope[renderToAlias].childAliases) {
//                        if (cfg.alias != $scope[renderToAlias].childAliases[i]) {
//                            $scope[renderToAlias].childAliases.push(cfg.alias)
//                        }
//                    }
//                } else {
//                    $scope[renderToAlias].childAliases = [alias];
//                    console.debug("--------childAliases:", $scope[renderToAlias])
//                }
//                console.debug("- map child:[" + cfg.alias + "] to parent:", renderToAlias)
//                console.debug("-        childAliases:", $scope[renderToAlias].childAliases)
                //                    console.debug("- $scope[" + renderInfo.include + "]=", renderInfo.newUrl)
                return renderInfo;
            }

            function removeOneByAlias(alias) {
                ViewCfgHelper.unBindAndClear(alias)
                ViewCfgs.clear(alias)
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
                    var newAlias = ViewCfgHelper.gen.id("alias");
                    var newAliasMode1 = '"' + newAlias + '.';
                    var newAliasMode2 = '"alias":"' + newAlias + '"';
                    cfgStr = eval('cfgStr.replace(/"' + alias + '\\./g, newAliasMode1)');
                    cfgStr = eval('cfgStr.replace(/"alias":"' + alias + '"/g, newAliasMode2)');
                }
            }
            console.debug("  reAlias后的结果>", cfgStr)
            cfg = JSON.parse(cfgStr);
            console.debug("  reAlias后的结果>", cfg)
            return cfg;
        },
        parseRenderTo: function (cfg) {
            var renderTo = cfg.renderTo;
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
            var newUrl = ViewCfgHelper.parseUrl(cfg);
            return {id: ViewCfgHelper.gen.id8(), alias: cfg.alias, renderToAlias: renderToAlias, include: subName, newUrl: newUrl}
        },
        gen: {
            aliasIndex: 1,
            id: function (salt) {
                Math.round(10)
                salt = salt || "id"
                //return salt + "_" + new Date().getMilliseconds()
                return salt + "_" + this.aliasIndex++
            },
            guid: function (needLinkFlag) {
                var link = needLinkFlag ? "-" : ""
                var S4 = this.id4;
                return S4() + S4() + link + S4() + link + S4() + link + S4() + link + S4() + S4() + S4();
            },
            id8: function () {
                var S4 = this.id4;
                return S4() + S4();
            },
            id4: function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
        }
    }

    $scope.$designer = {
        toolbarUrl: "m/ui/design/view_design_toolbar.mustache",
        designable: $stateParams.designable,

        getFullCfg: function () {

        },
        saveCfg: function () {
            var item = {
                id: ViewCfgs.rootId,
                name: ViewCfgs.rootAlias || 'rootName',
                alias: ViewCfgs.rootAlias || 'rootAlias',
                content: JSON.stringify(ViewCfgs.getAll())
            }
            console.debug(">> saveCfg > ")
            console.debug("-content >", ViewCfgs.getAll())
            console.debug("-  count >", ViewCfgs.count())
            $$Data.entity("ui.viewCfg").save(item, function (data) {
                ViewCfgs.rootId = data.id;
            })
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
//                $scope[targetView.renderTo] = ViewCfgHelper.parseUrl(targetView)
//                break;
//            }
//        }
//    }


    /**
     * @param paramWrapper {id:"",name:"",alias:"",params:{renderTo:"",item:""}}
     */
    $scope.openView = function (paramsWrapper) {
        loadAndParseCfg(paramsWrapper, function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);
        })
    }

    function openViewByCfg(cfg, params) {
        console.debug(">>openViewByCfg > renderAll >")
        console.debug("- cfg>", cfg);
        console.debug("- params>", params)
        var renderTo = params ? params["renderTo"] : undefined;
        cfg["renderTo"] = renderTo || cfg["renderTo"]
        ViewCfgHelper.renderAll(cfg, params, $scope, $$Data)
    }

    /**
     *
     * @param param
     */
    $scope.showModal = function (paramsWrapper) {
        console.debug("showModal")
        loadAndParseCfg(paramsWrapper, function (cfg) {
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
