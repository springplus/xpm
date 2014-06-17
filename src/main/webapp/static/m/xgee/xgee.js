/**
 * Created by hongxq on 2014/6/11.
 */

var xgee = angular.module('xgee',['ngResource']);

xgee.provider('$xgeeRouter', function $xgeeRouterProvider($stateProvider) {

    this.state = $stateProvider.state;

    this.setResState = function (resConfig) {
        try {
            console.debug(">>>#########start to parse resConfig and set state#########>>>", resConfig)
//            setDefault(resConfig);
            //检查数据是否正常
//            if (!checkEntityConfig(resConfig)) {
//                console.error(">>>数据格式不符合要求>>>未setPromiseCrudState,resConfig:", resConfig);
//                return;
//            }

            //-----eg：sys.role，有两项，则在父级中的视图sys中展示
            var moduleStateMapping = this.parser().parseAll(resConfig.moduleName, resConfig.resName)
            log(moduleStateMapping);
            console.debug("- mustacheUrl（采用）")
            var moduleViews = {};
            moduleViews[moduleStateMapping.view] = {templateProvider: function ($http) {
                return tmpl_crud_view(moduleStateMapping.mustacheUrl, $http, resConfig)
            }}
            $stateProvider.state(moduleStateMapping.state, { url: moduleStateMapping.stateUrl, views: moduleViews, controller: moduleStateMapping.controller  })


            //-----eg: sys.role.mixListPlus 有三项，则在父级中的视图sys_role中展示
            var mainStateMapping = this.parser().parseAll(resConfig.moduleName, resConfig.resName, resConfig.view.name)
            log(mainStateMapping);
            console.debug("- mustacheUrl（采用）")
            var mainViews = {};
            mainViews[mainStateMapping.view] = {templateProvider: function ($http) {
                return tmpl_crud_view(mainStateMapping.mustacheUrl, $http, resConfig);
            }}
            $stateProvider.state(mainStateMapping.state, { url: mainStateMapping.stateUrl, views: mainViews, controller: mainStateMapping.controller  })

            //-----eg: sys.role.mixListPlus.detail or sys.role.mixListPlus.tabs_detail
            //有四项，则在视图sys_role_mixListPlus_detail or sys_role_mixListPlus_tabs_detail中展示
            for (var containerName in resConfig.view.containers) {
                var container = resConfig.view.containers[containerName];
                for (var viewIndex in container) {

                    if (container[viewIndex].template && container[viewIndex].template.data) {
                        resConfig.view.containers[containerName][viewIndex].template.data = setFormDefault(resConfig.view.containers[containerName][viewIndex].template.data);
                        console.debug(">>>>>>>>>", resConfig);
                        //采用mustache的模板
                        var mustacheStateMapping = this.parser().parseAll(resConfig.moduleName, resConfig.resName, resConfig.view.name, containerName, container[viewIndex].name,container[viewIndex].template.dir)
                        log(mustacheStateMapping);
                        console.debug("- mustacheUrl（采用）")
                        var subViews = {};
                        subViews[mustacheStateMapping.view] = {templateProvider: function ($http) {
                            return tmpl_crud_view(mustacheStateMapping.mustacheUrl, $http, resConfig)
                        }}
                        $stateProvider.state(mustacheStateMapping.state, { url: mustacheStateMapping.stateUrl, views: subViews, controller: mustacheStateMapping.controller  })

                    } else {

                        //采用各模块中的自定义的angular模板文件，一般是为了自定义一些复杂或非常规的html页面
                        var htmlStateMapping = this.parser().parseAll(resConfig.moduleName, resConfig.resName, resConfig.view.name, containerName, container[viewIndex].name)
                        log(htmlStateMapping);
                        console.debug("- htmlUrl（采用）")
                        var subViews = {};
                        subViews[htmlStateMapping.view] = { templateUrl: htmlStateMapping.htmlUrl }
                        $stateProvider.state(htmlStateMapping.state, { url: htmlStateMapping.stateUrl, views: subViews, controller: htmlStateMapping.controller  })
                    }

                }
            }
        } catch (e) {
            console.error("设置state时出错!", resConfig)
            console.error(e.stack)
        }
        console.debug("<<<#########end to parse resConfig and set state#########<<<")

        function log(mapping) {
            console.debug(">>>mapping state>>", mapping.state)
            console.debug("- stateUrl:", mapping.stateUrl)
            console.debug("- view:", mapping.view)
            console.debug("- controller:", mapping.controller)
            console.debug("- htmlUrl:", mapping.htmlUrl + "   （若配置选用html则采用此url）")
            console.debug("- mustacheUrl:", mapping.mustacheUrl + "   （若配置选用mustache则采用此url）")
        }

        function checkEntityConfig(resConfig) {
            var ec = resConfig;
            if (!ec) {
                logErrorMsg('resConfig不能为空');
                return false
            }
            else if (!ec.moduleName || !ec.resName || !ec.view || !ec.view.container) {
                logErrorMsg('resConfig的属性moduleName、resName、list、containers不能为空。');
                return false;
            } else {
                var viewIsOk = true;
                for (var viewTypeIndex in ec.view.container) {
                    for (var viewIndex in ec.view.container[viewTypeIndex]) {
                        var view = ec.view.container[viewTypeIndex][viewIndex];
                        if (!view.title || !view.name) {
                            logErrorMsg('view.container[x]的属性title、ame不能为空。', view);
                            viewIsOk = false;
                        }
                    }
                }
                if (!viewIsOk)return false;
                if (!ec.view.name) {
                    logErrorMsg("list", ec.list)
                }
            }
            return true;
        }

        /**
         * //TODO 涉及模板的设置，应在模板的方法中进行设置，而不是state中进行设置，同时需考虑性能，在这里是初始化时设置一次，在模板那需多次调用
         *
         * 设置resConfig的默认值
         * @param resConfig
         */
        function setDefault(resConfig) {
            var defaultActions = {
                add: {name: '添加', openContainer: "tabs", viewName: 'detail', enable: true},
                delete: {name: '删除', openContainer: "none", viewName: 'none', enable: true},
                update: {name: '更新', openContainer: "tabs", viewName: 'detail', enable: true},
                read: {name: '查看', openContainer: "tabs", viewName: 'detail', enable: true},
                query: {name: '查询', openContainer: "none", viewName: 'list', enable: true}
            }
            if (!resConfig.view.actions) {
                resConfig.view.actions = {};
            }
            if (!resConfig.view.actions) {
                resConfig.view.actions = defaultActions;//TODO 应是数据类型
            } else {
                if (!angular.isObject(resConfig.list.actions.default)) {
                    console.error("resConfig.list.actions.default必须为json对象格式。", resConfig.list.actions.default)
                    return;
                }

                for (var defaultActionCode in defaultActions) {
                    var defaultAction = defaultActions[defaultActionCode]
                    var act = resConfig.list.actions.default[defaultActionCode]
                    if (!act) {
                        resConfig.list.actions.default[defaultActionCode] = defaultAction;
                    } else {
                        for (var p in defaultAction) {
                            var pv = resConfig.list.actions.default[defaultActionCode][p];
                            resConfig.list.actions.default[defaultActionCode][p] = angular.isString(pv) && pv.length > 0 || pv != undefined ? pv : defaultActions[defaultActionCode][p]
                        }
                    }
                }
            }
            console.debug(">>after list.actions.default set,the action.default is >>", resConfig.list.actions.default)
            return resConfig;
        }

        /**
         * 设置formConfig的必填项标识属性required，以便于在模板设置时可以显示*号
         * @param formConfig
         * @returns {*}
         */
        function setFormDefault(formConfig) {
            if (formConfig == null || formConfig == undefined)return undefined;
            for (var fieldIndex in formConfig) {
                for (var ruleIndex in formConfig[fieldIndex].rules) {
                    if (formConfig[fieldIndex].rules[ruleIndex].type == "empty") {
                        formConfig[fieldIndex].required = true;
//                        console.debug(">>>set formConfig[field].required = true>>>", formConfig[fieldIndex].title)
                        break;
                    }
                }
            }
            return formConfig;
        }

        function logErrorMsg(checkedInfo, data) {
            console.error(">>>数据格式有误>>>" + checkedInfo + ">>>", data)
        }
    }

    this.setModuleState = function (moduleName) {
        $stateProvider.state(moduleName, {
            url: "/" + moduleName,
            views: {
                index: { template: "<div id='" + moduleName + "' ng-controller='" + moduleName + "'>" +
                    "<div ui-view='" + moduleName + "'><\/div>" +
                    "<\/div>"
                }
//                index:{
//                    templateUrl:"m/"+moduleName+"/index.html"
//                }
            },
            controller: 'sys'
        })
    }
//    this.state = $stateProvider.state;


    this.parser = function () {
        //命名规则!!!!
        var _state = "{{moduleName}}.{{resName}}.{{mainView}}.{{container}}_{{subView}}"
        var _view = "{{moduleName}}_{{resName}}_{{mainView}}_{{container}}_{{subView}}"
        //为了便于页面的重用、引用，将controller及htmlUrl中的container去掉，不做限定，以便于在多个container可共用
        var _controller = "{{moduleName}}_{{resName}}_{{mainView}}_{{subView}}"
        var _htmlUrl = "m\\{{moduleName}}\\{{resName}}\\{{mainView}}_{{subView}}.html"
        var _mustacheUrl = "m\\tmpl\\{{templateDir}}\\{{mainView}}_{{container}}_{{subView}}.mustache"

        this.parseAll = function (moduleName, resName, mainView, container, view,templateDir) {
            var mapping = {};
            mapping.state = this.parseState(moduleName, resName, mainView, container, view,templateDir);
            mapping.stateUrl = this.parseStateUrl(moduleName, resName, mainView, container, view,templateDir);
            mapping.view = this.parseView(moduleName, resName, mainView, container, view,templateDir);
            mapping.controller = this.parseController(moduleName, resName, mainView, container, view,templateDir);
            mapping.htmlUrl = this.parseHtmlUrl(moduleName, resName, mainView, container, view,templateDir);
            mapping.mustacheUrl = this.parseMustacheUrl(moduleName, resName, mainView, container, view,templateDir);
            return mapping;
        }

        var removeRedundantSign = function (str) {
            //替换多个点号为一个点号
            var result = str.replace(/(\.+)/g, ".");
            //替换多个"_"为一个
            result = result.replace(/(\_+)/g, "_");
            //'替换"._"为空
            result = result.replace(/(\._)/g, "");
            //'替换"_."为"."
            result = result.replace(/(_\.)/g, "\.");
            //去掉空格
            result = result.replace(/(\s)/g, "");
            //去除右边的点号为空，去除右边($)的"_"
            result = result.replace(/(\.*$)|(\_*$)/g, "");
            //特殊情况，针对listView,container,view都为空的场景，将“\.”替换为默认的index
            result = result.replace(/(\\\.)/g, "\\index.");
            return result;
        }

        this.parseStateUrl = function (moduleName, resName, mainView, container, subView,templateDir) {
            var stateName = this.parseState(moduleName, resName, mainView, container, subView, _state,templateDir)
            var flags = stateName.split(".");
            if (flags.length == 4)
                return "/" + flags[flags.length - 1] + "/:item"
            else return "/" + flags[flags.length - 1];
        }
        this.parseState = function (moduleName, resName, mainView, container, subView,templateDir) {
            return parse(moduleName, resName, mainView, container, subView, _state,templateDir)
        }
        this.parseView = function (moduleName, resName, mainView, container, subView,templateDir) {
            function replaceSign(str) {
                return str.replace(/(\.)/g, "_");
            }

            //基于stateName，以“.”进行替换，以免因传入参数中带“_”导致解析出错。
            var stateName = this.parseState(moduleName, resName, mainView, container, subView, _state,templateDir)
            //对于最长的detail state，如sys.user.mixListPlus.tabs_detail,其页面数据将在ui-view:sys_user_mixListPlus_tabs_detail展示
            if (subView) {
                return replaceSign(stateName);
            }
            //对于一般的list state，如sys.user.mixListPlus，其页面数据将在ui-view:sys_user展示
            //对于最短的res state，如sys.user，其页面数据将在ui-view sys展示
            //即都是取视图取上一级
            else if (mainView || resName) {
                return replaceSign(stateName.substring(0, stateName.lastIndexOf(".")))
            }
            console.error(">>>parseView>>>未支持该视图解析，对应state为：", stateName)
            return ""
        }
        this.parseController = function (moduleName, resName, mainView, container, subView,templateDir) {
            return parse(moduleName, resName, mainView, container, subView, _controller,templateDir)
        }
        this.parseHtmlUrl = function (moduleName, resName, mainView, container, subView,templateDir) {
            return parse(moduleName, resName, mainView, container, subView, _htmlUrl,templateDir)
        }
        this.parseMustacheUrl = function (moduleName, resName, mainView, container, subView,templateDir) {
            return parse(moduleName, resName, mainView, container, subView, _mustacheUrl,templateDir)
        }
        var parse = function (moduleName, resName, mainView, container, subView, template,templateDir) {
            var data = {
                moduleName: moduleName,
                resName: resName,
                mainView: mainView,
                container: container,
                subView: subView,
                templateDir:templateDir?templateDir:'xgee'
            }
            return removeRedundantSign(Mustache.render(template, data))
        }

        return this;
    }


    //TODO 模板应是在打开app时加载，不应每次通过http再获取，可以降低接口的复杂度
    function tmpl_crud_view(mustacheTmplUrl, $http, config) {
        //依据url找出当前

        //TODO 需考模板是绝对路径的情况
        console.debug(">>>get template from:" + mustacheTmplUrl);
        return $http.get(mustacheTmplUrl).then(function (response) {
            console.debug(">>>Mustache.render>>>模板转换变量>>>", config)
            console.debug(">>>Mustache.render>>>转换前模板>>>")
            console.debug(response.data)
            var result = Mustache.render(response.data, config)
            console.debug(">>>Mustache.render>>>转换后模板>>>")
            console.debug(result)
            if (result == undefined || result.length == 0)
                console.error("Mustache.render转换后模板模板内容为空，请检查模板mustacheUrl、模板内的变量是否设置正确。", config)
            return result;
        });
    }


    this.$get = function () {
        return this
    };
})
