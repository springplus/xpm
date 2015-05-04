/**
 * Created by hongxq on 2014/7/19.
 */
;
var ViewBaseCtrl = Fiber.extend(function () {
    var viewState = {} //active,disabled,normal
    var varRmState = {}//readonly|modify
    return {
        $cfg: undefined,
        $scope: undefined,
        $Data: undefined
        // The `init` method serves as the constructor.
        //init: function () {
            // Private
//            function private1(){}
//            function private2(){}
            // Privileged
        //}

        // Public
    }
});

//TODO!!!!!!
//如果renderTo写错了，如下：将无法render到页面上，从而无法进行配置。
// "name": "views_tabs_simple",
//"alias": "alias_4",
//"dir": "",
//"renderTo": "alias_4",
function ui_design_index($scope, $stateParams, $$Data) {

    $scope.viewCfgs = {}


    var $alias$ = {};

    function init() {
        $scope.$parent.loadModulesMenu('ui');
        $scope.openViewFromSrv($stateParams.id,null,null,{})
    }
    var Settings = {
        rootSrc: "rootIndex",
        rootEditorSrc:"rootViewEdit",
        rootModalSrc:'rootModal'
    }
    $scope.Settings = Settings;
    var ViewCfgManager = (function (scope) {

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
                        console.debug(">> link    at >",renderInfo.alias)
                        ViewCfgLinker.linkInSubViews(cfg,rootCfg.value,renderInfo.alias);
                    }
                    cfgScope[cfg.alias] = {sn: index, by: by, key: key, value: cfg}
                },
                getAll: function () {
                    return cfgScope;
                },
                //TODO deep get in cfg
                findOne: function (alias) {
                    if (!cfgScope[alias]) {
                        //deep
                        for (var i in cfgScope) {
                            var cfg = cfgScope[i].value;
                            var foundCfg = ViewCfgQuerier.findCfgByAlias(alias, cfg);
                            console.debug(">> ViewCfgQuerier.findCfgByAlias(" + alias + ") in ", cfg);
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
                loadAndParseCfg: function (paramsWrapper,isReplace,successFn) {
                    if (!paramsWrapper)return;
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
                                var reAliasCfg = parse(cfg,isReplace);
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
                                var reAliasCfg = parse(cfg,isReplace);
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
                                var reAliasCfg = parse(cfg,isReplace);
                                ViewCfgs.set("byName", paramsWrapper.name, reAliasCfg);
                                successFn(reAliasCfg)
                            } else {
                                logFail("byName", paramsWrapper.name);
                            }
                        })
                    function logFail(by, key) {
                        console.error("- Fail to parse cfg,because the cfg loaded " + by + "(\"" + key + "\") is undefined.");
                    }

                    function parse(cfg,isReplace) {
                        var renderInfo =  ViewCfgParser.parseRenderTo(cfg);
                        var parentAlias = renderInfo.renderToAlias;
                        var ignoreAlias = "",replaceAlias = "";
                        if(isReplace){
                            console.debug(">>replace cfg at parse phase")
                            console.debug("- find prevRenderInfo by currentRenderInfo>",renderInfo)
                            var prevRenderInfo = ViewCfgRenderer.current.find(renderInfo);
                            console.debug("- found prevRenderInfo>",prevRenderInfo)
                            if(prevRenderInfo){
                                replaceAlias = prevRenderInfo.alias
                                cfg.alias = replaceAlias;
                                ignoreAlias = replaceAlias;
                            }else{
                                console.debug("- currentRenderInfoDict>",ViewCfgRenderer.current.dict)
                                console.error("- fail to replace cfg,for have no prevRenderInfo found.")
                            }
                        }
                        var reAliasCfg = ViewCfgHelper.reAlias(cfg,ignoreAlias);
                        ViewCfgParser.parseAndBind(reAliasCfg,parentAlias,isReplace)
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
                parseAndBind: function (cfg,parentAlias,isRedoOrReplace) {
                    if (!cfg.alias) {
                        console.error(">>cfg未配置alias,cfg:", cfg);
                        return;
                    }
                    if ($$scope[cfg.alias]&&!isRedoOrReplace) {
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
                            ViewCfgParser.parseAndBind(cfg.views[i],cfg.alias,false);
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
            var renderInfoDict ={};//key:includeSrc,value:renderInfo
            function genRenderKey(renderInfo){
                var alias = renderInfo.renderToAlias||"";
                return alias+".include."+renderInfo.include
            }
            function push(renderInfo) {
                renderHistoryInfoAry.push(renderInfo)
                renderInfoDict[genRenderKey(renderInfo)]=renderInfo;
            }
            var history = (function () {
                return {

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
                        return {};
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
                        return {};
                    }
                }
            })()
            var current = (function(){
                return {
                    find:function(fullIncludeSrcOrRenderInfo){
                        var matchSrc = "";
                        if(angular.isString(fullIncludeSrcOrRenderInfo))matchSrc=fullIncludeSrcOrRenderInfo;
                        if(angular.isObject(fullIncludeSrcOrRenderInfo))matchSrc=genRenderKey(fullIncludeSrcOrRenderInfo);
                        return renderInfoDict[matchSrc];
                     },
                    dict:renderInfoDict
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
                    if (!cfg||!cfg.alias) {
                        console.error(">>cfg and cfg.alias are required,the cfg and params are:");
                        console.debug(" - cfg>", cfg);
                        console.debug(" - params>", params)
                        return;
                    }
                    console.debug(">>======render========")
                    console.debug("- alias:",cfg.alias);
                    console.debug("- name :",cfg.name);
                    console.debug("----------------------");
                    var self = this;

                    var alias = cfg.alias
                    $$scope[alias].params.$extend(params);
                    //加载页面模板
                    var renderInfo = renderOneAndBindOldUrl(cfg);
                    ViewCfgRenderer.push(renderInfo);
//                        console.debug("-    render cfg>", cfg)
//                        console.debug("-    renderInfo>", renderInfo)
                    //--delete old view
                    var prevRenderInfo = ViewCfgRenderer.history.findPrev(renderInfo);
                    console.debug("- prevRenderInfo to remove>", prevRenderInfo)
                    if (prevRenderInfo&&prevRenderInfo.alias!=cfg.alias)removeOneByAlias(prevRenderInfo.alias);
                    //加载页面配置数据
                    //TODO window换成是所有views_xx_xx的owner
                    var ctrl = undefined;
                    if (window[cfg.name]) {
                        ctrl = eval("new " + cfg.name + "($scope,$$scope[alias],ViewCfgManager)")
//                        $$scope[alias].ctrl = ctrl;
                        if (angular.isFunction(ctrl.init)) {
                            ctrl.init(cfg)
                        }
                    } else {
                        console.warn("- 未配置视图的同名函数:", cfg.name)
                    }
                    loadData(cfg, $scope, $$Data);
                    //递归render子视图
                    if (cfg.views && angular.isArray(cfg.views))
                        for (var i in cfg.views) {
                            ViewCfgRenderer.renderAll(cfg.views[i], null)
                        }
                    function renderOneAndBindOldUrl(cfg) {
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
                        console.debug("- prevRenderInfo removed > alias:", alias)
                    }
                },
                push:push,
                history: history,
                current:current
            }
        })(scope.$cm)
        var ViewCfgLinker = {
            linkInSubViews:function (cfg,linkToCfg,atAlias){
                console.debug("- matching alias:'"+atAlias+"' in >",linkToCfg)
                for(var i in linkToCfg.views){
                    if(linkToCfg.views[i].alias==atAlias){
                        //TODO 原有的资源是否需clean
                        linkToCfg.views[i]=cfg
                        console.debug("- success replace >",linkToCfg.views[i])
                        return;
                    }
                    this.linkInSubViews(cfg,linkToCfg.views[i],atAlias)
                }
            }
        }
        var ViewCfgQuerier = (function () {
            return {
                findCfgByAlias: function (alias, inCfg) {
                    if (inCfg.alias == alias) {
                        return inCfg;
                    } else {
                        for (var i in inCfg.views) {
                            console.debug("- find in ", inCfg.views[i].alias)
                            var foundCfg = this.findCfgByAlias(alias, inCfg.views[i])
                            if (foundCfg)return foundCfg;
                        }
                        return undefined;
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
//                cfg.alias=cfg.alias||"tempAlias"+ViewCfgHelper.gen.id8();
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
//                var baseAlias = cfg.alias;
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
            renderDict:ViewCfgRenderer.current.dict,
            getCfgs: ViewCfgs.getAll,
            getCount: ViewCfgs.count,
            scope:scope
        }
    })($scope)
    var $$scope = ViewCfgManager.scope;

    $scope.$designer = (function(){
        var designStates={SELECTING:"selecting",EDITING:"editing"};
        return {
            toolbarUrl: "m/ui/design/view_design_toolbar.mustache",
            designable: $stateParams.designable,
            designStates:designStates,
            designState:designStates.SELECTING,//selecting|editing
            renderDict:ViewCfgManager.renderDict,
            showViewEditor:function(paramsWrapper){
                this.designState = this.designStates.EDITING;
                $scope.openView(paramsWrapper);
            },
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
                    console.debug(">>save success resp data>",data)
                    $scope.$designer.lastSaveTime = new Date()
                    $scope.$designer.lastId = data.id;
                })
            },
            enable: function (obj) {
                console.debug(">>angular.element(this)>>", this)
            },
            disable: function (obj) {

            },
            createView: function (id) {

            }
        }
    })();

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
            console.error(">>No actionHandler found for actionType:",action.type)
        }
//        $scope[srcAliasStr].ctrl[action.name].apply($scope[srcAliasStr].ctrl, [action])
    }

    var ActionHandler = (function () {
        {
            var handlers = {}
            return{
                get: function (actionType) {
                    return handlers.hasOwnProperty(actionType)?handlers[actionType]():undefined;
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
                if(!action.alias)console.error(">>Alias is required in action:",action);
                var act = angular.copy(action)
                act.renderTo = act.renderTo||act.alias;
                $scope.openView(act)
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
     * @param paramWrapper {id:"",name:"",alias:"",renderTo:"",srcAlias:"",params:{item:""}}
     */
    $scope.openView = function (paramsWrapper) {
//        if(!paramsWrapper.renderTo)paramsWrapper.renderTo = paramsWrapper.params.renderTo;
        if(paramsWrapper.isReplace){
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
        console.debug(">>openViewByCfg")
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

    var jsonEditor = undefined
    $scope.showJSONEditor = function (json) {
        if(!jsonEditor){
            var container = document.getElementById("jsonEditor");
            jsonEditor = new JSONEditor(container,{mode:'form'});
        }


        // set json
        jsonEditor.set(json);
        jsonEditor.expandAll();
//        jsonEditor.setMode(mode)
        // get json
//        var json = editor.get();
    }
    init();

}
