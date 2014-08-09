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

function ui_design_index($scope, $stateParams, $$Data) {



    $scope.viewCfgs = {}


    var $alias$ = {};

    function init() {
        $scope.$parent.loadModulesMenu('ui');
        $scope.openViewFromSrv($stateParams.id,null,null,{})
    }

    var ViewCfgManager = (function (scope) {
        var Settings = {
            rootSrc: "rootIndex"
        }
        //configManager key:alias value config
        scope.$cm = {};
        var ViewCfgs = (function (scope) {
            var cfgScope = scope.$cm
            var rootCfg = {
                id: "", alias: "",value:{}
            }
            var index = 0;
            var count = {
                byId: 0,
                byName: 0,
                byAlias: 0
            }

            var ignoreViewsToSave = {"views_design_select": true};
            return {
                set: function (by, key, cfg) {
                    if (!cfg.alias||ignoreViewsToSave[cfg.name])return;
                    index++;
                    count[by]++;
                    if (count.byId == 1) {
                        rootCfg.id = key;
                        rootCfg.alias = cfg.alias;
                    }
                    if(this.count()==1)rootCfg.value = cfg;
                    var renderInfo = $$scope[cfg.alias].renderInfo;
                    console.debug(">>ViewCfgs.set")
                    console.debug("- renderInfo >",renderInfo)
                    console.debug("- rootCfg >",rootCfg)
                    console.debug("-------------")
                    if(rootCfg.alias==renderInfo.alias){
                        rootCfg.value = cfg;
                    }else{
                        console.debug(">> link    at >",renderInfo.renderToAlias)
                        ViewCfgLinker.linkInSubViews(cfg,rootCfg.value,renderInfo.renderToAlias);
                    }
                    cfgScope[cfg.alias] = {sn: index, by: by, key: key, value: cfg}
                    console.debug(">>scope.$cm >",scope.$cm)
                },
                getAll: function () {
                    return cfgScope;
                },
                //TODO deep get in cfg
                findOne: function (alias) {
                    if (!cfgScope[alias]) {
                        //deep
                        for (var i in cfgScope) {
                            var cfg = cfgScope[i];
                            var foundCfg = ViewCfgQuerier.findCfgByAlias(alias, cfg);
                            console.debug(">>ViewCfgs.findOne(" + alias + ") inCfg", cfg);
                            console.debug("- foundCfg", foundCfg);
                            if (foundCfg)return foundCfg;
                        }
                    }
                    return {}
                },
                clear: function (alias) {
                    //TODO 删除子view
                    if (cfgScope[alias]) {
                        count[cfgScope[alias].by]--
                        delete cfgScope[alias];
                    }
                },
                count: function () {
                    return count.byId + count.byName + count.byAlias
                },
                rootCfg: rootCfg
            }
        })(scope)
        var ViewCfgLoader = {
            //从服务端加载
            loadFromSrv: function (id, successFn) {
                $$Data.entity("ui.viewCfg").get({id: id}, successFn)
            },
            //从内存中获取
            loadFromLocal: function (alias, successFn) {
                successFn(ViewCfgs.findOne(alias));
            },
            //从文件中加载配置，基于文件名
            loadFromFile: function (name, successFn) {
                $$Data.jsonFile.get({dir: "ui/" + name, file: "define"}, function (data) {
                    console.debug(">>byName('" + name + "',...) response:", data)
                    successFn(data.cfg);
                })
            }
        }
        var ViewCfgParser = (function () {
            return {
                loadAndParseCfg: function (paramsWrapper,needReplace,successFn) {
                    if (!paramsWrapper)return;

//                    replaceAlias = replaceAlias||"";
                    if (paramsWrapper.id) {
                        ViewCfgLoader.loadFromSrv(paramsWrapper.id, function (data) {
                            var cfg = {}
                            try {
                                cfg = JSON.parse(data.content);
                            } catch (e) {
                                console.error(">>解析JSON配置信息data.content出错。\r\n- data.content:", data.content);
                                return;
                            }
                            if (cfg) {
                                //view order TODO
                                var reAliasCfg = parse(cfg,needReplace);
                                ViewCfgs.set("byAlias", reAliasCfg.alias, reAliasCfg);
                                successFn(reAliasCfg)
                            } else {
                                logFail("byId", paramsWrapper.id);
                            }
                        })
                    }
                    else if (paramsWrapper.alias)
                        ViewCfgLoader.loadFromLocal(paramsWrapper.alias, function (cfg) {
                            if (cfg) {
                                //TODO need to copy cfg？
                                cfg["renderTo"] = paramsWrapper.renderTo || cfg["renderTo"]
                                var reAliasCfg = parse(cfg,needReplace);
                                ViewCfgs.set("byAlias", paramsWrapper.alias, reAliasCfg);
                                successFn(reAliasCfg)
                            } else {
                                logFail("byAlias", paramsWrapper.alias);
                            }
                        })
                    else if (paramsWrapper.name)
                        ViewCfgLoader.loadFromFile(paramsWrapper.name, function (cfg) {
                            if (cfg) {
                                cfg["renderTo"] = paramsWrapper.renderTo || cfg["renderTo"]
                                var reAliasCfg = parse(cfg,needReplace);
                                ViewCfgs.set("byName", paramsWrapper.name, reAliasCfg);
                                successFn(reAliasCfg)
                            } else {
                                logFail("byName", paramsWrapper.name);
                            }
                        })
                    function logFail(by, key) {
                        console.error("- Fail to parse cfg,because the cfg loaded " + by + "(\"" + key + "\") is undefined.");
                    }

                    function parse(cfg,needReplace) {
                        var renderInfo =  ViewCfgParser.parseRenderTo(cfg);
                        var parentAlias = renderInfo.renderToAlias;
                        var ignoreAlias = "",replaceAlias = "";
                        if(needReplace){
                            var prevRenderInfo = ViewCfgRenderer.history.findPrevWithoutUrlMatch(renderInfo);
                            if(prevRenderInfo){
                                replaceAlias = prevRenderInfo.alias
                                cfg.alias = replaceAlias;
                                ignoreAlias = replaceAlias;
                            }
                        }
                        var reAliasCfg = ViewCfgHelper.reAlias(cfg,ignoreAlias);
                        ViewCfgParser.parseAndBind(reAliasCfg,parentAlias)
                        return reAliasCfg;
                    }

                },
                parseRenderTo: function (cfg) {
                    var renderTo = cfg.renderTo;
                    var dotIndex = renderTo.indexOf(".");
                    var renderToAlias = ""
                    var subName = "";
                    if (dotIndex == 0) {
                        //格式：".xxx"，表示加载到parent的视图中
                        renderToAlias = $$scope[cfg.alias]?$$scope[cfg.alias].parentAlias:"";
                        subName = renderTo.substring(1)
                    } else if (dotIndex > 0) {
                        //格式：“alias.xxx”||“alias.include.xxx”，表示加载到指定的视图中
                        var rto = renderTo.split(".");
                        renderToAlias = rto[0];
                        subName = rto.length == 2 ? rto[1] : (rto.length == 3 ? rto[2] : console.error(">>>renderTo格式有误,应为xx | .xx | $alias$.xx | $alias$.include.xx>>", renderTo));

                    } else {
                        //格式："xxx"，表示加载到parent的视图中
                        renderToAlias = $$scope[cfg.alias]?$$scope[cfg.alias].parentAlias:"";
                        subName = renderTo;
                    }
                    var newUrl = ViewCfgHelper.parseUrl(cfg);
                    return {id: ViewCfgHelper.gen.id8(), alias: cfg.alias, renderToAlias: renderToAlias, include: subName, newUrl: newUrl}
                },
                parseAndBind: function (cfg,parentAlias) {
                    if (!cfg.alias) {
                        console.error(">>cfg未配置alias,cfg:", cfg);
                        return;
                    }
                    if ($$scope[cfg.alias]) {
                        console.error(">>cfg已存在alias：", cfg.alias);
                        return;
                    }
                    //各实例初始化变量示例
                    $$scope[cfg.alias] = {}
                    $$scope[cfg.alias].params = {
                        $extend:function(params){
                            var self = this;
                            if(params){
                                for(var i in params){
                                    console.debug(">>proName>",i)
                                    console.debug(">>value>",params[i])
                                    self[i] = params[i];
                                }
                            }
                            return self;
                        }
                    }//页面打开时输入的参数 //TODO 改为VO
                    $$scope[cfg.alias].data = {};

                    $$scope[cfg.alias].cfg = cfg;
                    $$scope[cfg.alias].include = {}; //{layoutEast:"",layoutNorth:""};
                    $$scope[cfg.alias].childAliases = [];
                    $$scope[cfg.alias].parentAlias = parentAlias;//TODO 最顶层cfg，无parentAlias是否可在外面进行设置？
                    //由于在renderTo前，cfg的renderTo值可能会被修改，故include值到时需再修改
                    $$scope[cfg.alias].renderInfo=ViewCfgParser.parseRenderTo(cfg);
                    //alias map to parent alias
                    if (cfg.views && angular.isArray(cfg.views))
                        for (var i in cfg.views) {
                            ViewCfgParser.parseAndBind(cfg.views[i],cfg.alias);
                            $$scope[cfg.alias].childAliases.push(cfg.views[i].alias)
                        }
                },
                unBindAndClear: function (alias) {
                    if (alias && $$scope[alias]) {
                        delete $$scope[alias]
                    }
                }
            }
        })()
        var ViewCfgRenderer = (function ($cm) {
            var renderHistoryInfoAry = []
            var history = (function () {
                return {
                    push: function (renderInfo) {
                        renderHistoryInfoAry.push(renderInfo)
                    },
                    //结合URL的变化精确查找：查找同一个parent alias，同一个include的上一个renderInfo
                    findPrev: function (renderInfo) {
                        if (renderHistoryInfoAry.length > 0) {
                            for (var i = renderHistoryInfoAry.length - 1; i > 0; i--) {
                                var info = renderHistoryInfoAry[i];
//                                console.debug(">>findPrev")
//                                console.debug("- renderToAlias >"+info.renderToAlias)
//                                console.debug("- renderToAlias >"+renderInfo.renderToAlias)
//                                console.debug("- include >"+info.include)
//                                console.debug("- include >"+renderInfo.include)
//                                console.debug("- newUrl >"+info.newUrl)
//                                console.debug("- oldUrl >"+renderInfo.oldUrl)
//                                console.debug("- id >"+info.id)
//                                console.debug("- id >"+renderInfo.id)
                                if (info.renderToAlias == renderInfo.renderToAlias && info.include == renderInfo.include && info.newUrl == renderInfo.oldUrl && info.id != renderInfo.id) {
                                    return info;
                                }
                            }
                        }
                        return undefined;
                    },
                    findPrevWithoutUrlMatch: function (renderInfo) {
                        if (renderHistoryInfoAry.length > 0) {
                            for (var i = renderHistoryInfoAry.length - 1; i > 0; i--) {
                                var info = renderHistoryInfoAry[i];
                                if (info.renderToAlias == renderInfo.renderToAlias && info.include == renderInfo.include &&  info.id != renderInfo.id) {
                                    return info;
                                }
                            }
                        }
                        return undefined;
                    }
                }
            })()
            return {
                /**
                 * 渲染视图及子视图,创建相关controller
                 * @param cfg
                 * @param renderTo 一般用于指定根节点在特定的位置中进行展示
                 * @param $$scope
                 * @param $$Data
                 */
                renderAll: function (cfg, params) {
                    var self = this;
                    if (cfg) {
                        var alias = cfg.alias
                        $$scope[alias].params.$extend(params);
                        //加载页面模板
                        var renderInfo = renderOneAndBindOldUrl(cfg);
                        ViewCfgRenderer.history.push(renderInfo);
//                        console.debug("-    render cfg>", cfg)
//                        console.debug("-    renderInfo>", renderInfo)
                        //--delete old view
                        var prevRenderInfo = ViewCfgRenderer.history.findPrev(renderInfo);
                        console.debug("- prevRenderInfo>", prevRenderInfo)
                        if (prevRenderInfo)removeOneByAlias(prevRenderInfo.alias);
                        //加载页面配置数据
                        //TODO window换成是所有views_xx_xx的owner
                        var ctrl = undefined;
                        if (window[cfg.name]) {
                            ctrl = eval("new " + cfg.name + "()")
                            $$scope[alias].ctrl = ctrl;
                            ctrl.alias = alias;
                            ctrl.owner = $$scope[alias];
                            ctrl.$scope = $$scope[alias];
                            ctrl.$$Data = $$scope[alias];
                            if (angular.isFunction(ctrl.afterInit)) {
                                ctrl.afterInit(cfg)
                            }
                        } else {
                            console.warn("- 未配置视图的同名函数:", cfg.name)
                        }
                        loadData(cfg, $scope, $$Data);
                        //递归render子视图
                        if (cfg.views && angular.isArray(cfg.views))
                            for (var i in cfg.views) {
                                ViewCfgRenderer.renderAll(cfg.views[i], null, $scope, $$Data)
                            }
                    }
                    function renderOneAndBindOldUrl(cfg) {
//                        console.debug(">>render1",$$scope[cfg.alias].renderInfo)
//                        console.debug(">>render2",ViewCfgParser.parseRenderTo(cfg))
                        //！！由于cfg的renderTo值有可能被修改，需重parse,并取include值
//                        $$scope[cfg.alias].renderInfo.include = ViewCfgParser.parseRenderTo(cfg).include;
                        var renderInfo = $$scope[cfg.alias].renderInfo;
                        var renderToAlias = renderInfo.renderToAlias;
                        //--set rootAlias
                        if (cfg.renderTo == Settings.rootSrc)ViewCfgManager.rootCfg.alias = cfg.alias;
                        //--set include src
                        //renderToAlias is false,that means, it's root cfg
                        if (renderToAlias) {
                            renderInfo.oldUrl = $$scope[renderToAlias].include[renderInfo.include];
                            $$scope[renderToAlias].include[renderInfo.include] = renderInfo.newUrl;
                        } else {
                            renderInfo.oldUrl = $$scope[renderInfo.include];
                            $$scope[renderInfo.include] = renderInfo.newUrl;
                        }
                        return renderInfo;
                    }

                    function removeOneByAlias(alias) {
                        ViewCfgParser.unBindAndClear(alias)
                        ViewCfgs.clear(alias)
                    }
                },
                history: history
            }
        })(scope.$cm)
        var ViewCfgLinker = {
            linkInSubViews:function (cfg,linkToCfg,parentAlias){
                console.debug("- matching parentAlias:'"+parentAlias+"' at >",linkToCfg)
                for(var i in linkToCfg.views){
                    if(linkToCfg.views[i].alias==parentAlias){
                        //TODO 原有的资源是否需clean
                        linkToCfg.views[i]=cfg
                        console.debug("- after  link >",linkToCfg)
                        return;
                    }
                    this.linkInSubViews(cfg,linkToCfg.views[i],parentAlias)
                }
            },
            link: function (fromCfg,toCfg,atParentAlias) {
                //存在同位置的则替换，不存在则添加到views中

                if(toCfg.alias==atParentAlias){

                }
                 var replaced = false;

            }
        }
        var ViewCfgQuerier = (function () {
            return {
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
                    var parentAlias = $$scope[cfg.alias].parentAlias;
                    return this.findCfgByAlias(parentAlias, cfg);
                }
            }
        })()
        var ViewCfgBinder = {
            bind:function(parsedCfg){

            },
            unbind:function(alias){
                if (alias && $$scope[alias]) {
                    delete $$scope[alias]
                }
            }
        }
        var ViewCfgHelper = {
            parseUrl: function (cfg) {
                //TODO 地址信息需提取出去
                var dir = cfg.dir ? cfg.dir + "/" : "";
                var ext = cfg.type ? ".html" : ".mustache?alias=" + cfg.alias;
                return "m/ui/design/" + dir + cfg.name + ext
            },

            /**
             * 自动生成alias，取代cfg中默认的alias,确保引用同一个view不冲突
             * @param cfg
             * @returns {*}
             */
            reAlias: function (cfg,ignoreAlias) {
                if (!cfg) {
                    console.error(" cfg to reAlias is ", cfg)
                    return;
                }
                var aliases = []
                function genAliasForReAlias(cfg) {
                    if (cfg) {
                        if(cfg.alias!=ignoreAlias)aliases.push(cfg.alias);
                        if (cfg.views)
                            for (var i in cfg.views) {
                                genAliasForReAlias(cfg.views[i])
                            }
                    }
                }

                genAliasForReAlias(cfg);
                //TODO 改成按属性遍历的实现方式，以免出现关键字替换出错
                var cfgStr = JSON.stringify(cfg);
//                console.debug("  reAlias后的结果>", cfgStr)
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

                cfg = JSON.parse(cfgStr);
                console.debug("  reAlias后的结果>", cfg)
                return cfg;
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

        return {
            rootCfg: ViewCfgs.rootCfg,
            loadAndParseCfg: ViewCfgParser.loadAndParseCfg,
            renderAll: ViewCfgRenderer.renderAll,
            renderOne: function (cfg) {

            },
            replaceCfg: function (targetCfg, srcCfg) {

            },
            getCfgs: ViewCfgs.getAll,
            getCount: ViewCfgs.count,
            scope:scope
        }
    })($scope)
    var $$scope = ViewCfgManager.scope;

    $scope.$designer = {
        toolbarUrl: "m/ui/design/view_design_toolbar.mustache",
        designable: $stateParams.designable,

        getFullCfg: function () {

        },
        saveCfg: function () {
            var item = {
                id: ViewCfgManager.rootCfg.id,
                name: ViewCfgManager.rootCfg.alias || 'rootName',
                alias: ViewCfgManager.rootCfg.alias || 'rootAlias',
                content: JSON.stringify(ViewCfgManager.rootCfg.value)
            }
            console.debug(">> saveCfg > ")
            console.debug("-content >", ViewCfgManager.getCfgs())
            console.debug("-  count >", ViewCfgManager.getCount())
            console.debug("- rootCfg >", ViewCfgManager.rootCfg)
            $$Data.entity("ui.viewCfg").save(item, function (data) {
                ViewCfgManager.rootCfg.id = data.id;
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
                $$Data.xqlBind({dataItemCfg: dataItemCfg, toObject: $$scope[cfg.alias]});
            }
        }
    }


    /**
     *
     * @param targetAliases alias,alias,alias
     */
    $scope.onAction = function (srcAliasStr, action) {
        console.debug(">>onAction from " + srcAliasStr + " > ", action);
        //TODO 可以考虑在这里做一些通用的操作，这样就可以简化各方法内的操作
        var handler = ActionHandler.get(action.type)
        if (handler) {
            handler.execute(action);
        } else {
            console.error(">>找不到合适的actionHandler.")
        }
//        $scope[srcAliasStr].ctrl[action.name].apply($scope[srcAliasStr].ctrl, [action])
    }

    var ActionHandler = (function () {
        {
            var handlers = {}
            return{
                get: function (actionType) {
                    return handlers[actionType]();
                },
                register: function (actionType, handler) {
                    handlers[actionType] = handler;
                },
                unRegister: function (actionType) {
                    if (handlers.hasOwnProperty(actionType))delete handlers[actionType]
                }
            }
        }
    })()
    ActionHandler.register("openView", function () {
        return {
            execute: function (action) {
                ViewCfgManager.loadAndParseCfg(action, function (cfg) {
                    openViewByCfg(cfg, action.params);
                })
            }
        }
    })

    ActionHandler.register("showModal", function () {
        return {
            execute: function (action) {

            }
        }
    })

    ActionHandler.register("newWin", function () {
        return {
            execute: function (action) {

            }
        }
    })

    ActionHandler.register("custom", function () {
        return {
            execute: function (action) {

            }
        }
    })

    /**
     * @param paramWrapper {id:"",name:"",alias:"",params:{renderTo:"",item:""}}
     */
    $scope.openView = function (paramsWrapper) {
//        if(!paramsWrapper.renderTo)paramsWrapper.renderTo = paramsWrapper.params.renderTo;
        if(paramsWrapper.needReplace){
            paramsWrapper.id?$scope.$designer.replaceViewFromSrv(paramsWrapper):"";
            paramsWrapper.name?$scope.$designer.replaceViewFromFile(paramsWrapper):"";
        }else{
            paramsWrapper.id?$scope.openViewFromSrv(paramsWrapper):"";
            paramsWrapper.name?$scope.openViewFromFile(paramsWrapper):"";
            paramsWrapper.alias?$scope.openViewFromLocal(paramsWrapper):"";
        }
    }
    $scope.openViewFromSrv = function(id,renderTo,srcAlias,params){
        var paramsWrapper = angular.isObject(id)?id:{id:id,renderTo:renderTo,srcAlias:srcAlias,params:params}
        ViewCfgManager.loadAndParseCfg(paramsWrapper, false,function (cfg) {
            console.debug("- initLoadAndParse callback cfg>", cfg)
            openViewByCfg(cfg);
        })
        ViewCfgManager.rootCfg.id = $stateParams.id;
    }
    $scope.openViewFromLocal = function(alias,renderTo,srcAlias,params){
        var paramsWrapper = angular.isObject(alias)?alias:{alias:alias,renderTo:renderTo,srcAlias:srcAlias,params:params}
        ViewCfgManager.loadAndParseCfg(paramsWrapper, false,function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);
        })
    }
    $scope.openViewFromFile = function(name,renderTo,srcAlias,params){
        var paramsWrapper = angular.isObject(name)?name:{name:name,renderTo:renderTo,srcAlias:srcAlias,params:params}
        ViewCfgManager.loadAndParseCfg(paramsWrapper, false,function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);
        })
    }
    $scope.$designer.replaceViewFromSrv = function(id,renderTo,srcAlias,params){
        var paramsWrapper = angular.isObject(id)?id:{id:id,renderTo:renderTo,srcAlias:srcAlias,params:params}
        //TODO need replaceFileName?
        ViewCfgManager.loadAndParseCfg(paramsWrapper, true,function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);
        })
    }
    $scope.$designer.replaceViewFromFile = function(name,renderTo,srcAlias,params){
        var paramsWrapper = angular.isObject(name)?name:{name:name,renderTo:renderTo,srcAlias:srcAlias,params:params}
        ViewCfgManager.loadAndParseCfg(paramsWrapper, true,function (cfg) {
            openViewByCfg(cfg, paramsWrapper.params);
        })
    }


    function openViewByCfg(cfg, params) {
        console.debug(">>openViewByCfg > renderAll >")
        console.debug("- cfg>", cfg);
        console.debug("- params>", params)
//        var renderTo = params ? params["renderTo"] : undefined;
//        cfg["renderTo"] = renderTo || cfg["renderTo"]
        ViewCfgManager.renderAll(cfg, params)
    }

    /**
     *
     * @param param
     */
    $scope.showModal = function (paramsWrapper) {
        if(paramsWrapper){
            if(paramsWrapper.id)this.openViewFromSrv(paramsWrapper);
            if(paramsWrapper.name)this.openViewFromFile(paramsWrapper);
            if(paramsWrapper.alias)this.openViewFromLocal(paramsWrapper);
        }
        //TODO 需检查在新增加时需show两次，若是地址没有变，页面中的onLoad可能没加载
        $("#rootModal").modal("show")
    }
    $scope.hideModal = function () {
        $("#rootModal").modal("hide")
    }

    $scope.onLoad = function(includeViewScope,srcAlas){
        console.debug(">> ng-include onLoad")
        console.debug("-  includeViewScope>",includeViewScope)
        console.debug("-  srcAlas",srcAlas)
        console.debug("- - -")
    }

    $scope.showJSONEditor = function (json) {
        new JSONEditor(document.getElementById('jsonEditor'), {mode: 'view'}, json);
    }
    init();

}
