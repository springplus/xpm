/**
 * Created by hongxq on 2014/5/26.
 */

appUtils.provider('$$appState', function $$appStateProvider($stateProvider) {

    this.setEntityCrudState = function (entityConfig) {
        try {
            console.debug(">>>#########start to parse entityConfig and set state#########>>>", entityConfig)
            setDefault(entityConfig);
            //检查数据是否正常
            if (!checkEntityConfig(entityConfig)) {
                console.error(">>>数据格式不符合要求>>>未setPromiseCrudState,entityConfig:", entityConfig);
                return;
            }

            //-----eg：sys.role，有两项，则在父级中的视图sys中展示
            var moduleStateMapping = this.parser().parseAll(entityConfig.moduleName, entityConfig.entityName)
            log(moduleStateMapping);
            console.debug("- mustacheUrl（采用）")
            var moduleViews = {};
            moduleViews[moduleStateMapping.view] = {templateProvider: function ($http) {
                return tmpl_crud_view(moduleStateMapping.mustacheUrl, $http, entityConfig)
            }}
            $stateProvider.state(moduleStateMapping.state, { url: moduleStateMapping.stateUrl, views: moduleViews, controller: moduleStateMapping.controller  })


            //-----eg: sys.role.mixListPlus 有三项，则在父级中的视图sys_role中展示
            var listStateMapping = this.parser().parseAll(entityConfig.moduleName, entityConfig.entityName, entityConfig.list.view)
            log(listStateMapping);
            console.debug("- mustacheUrl（采用）")
            var listViews = {};
            listViews[listStateMapping.view] = {templateProvider: function ($http) {
                return tmpl_crud_view(listStateMapping.mustacheUrl, $http, entityConfig);
            }}
            $stateProvider.state(listStateMapping.state, { url: listStateMapping.stateUrl, views: listViews, controller: listStateMapping.controller  })

            //-----eg: sys.role.mixListPlus.detail or sys.role.mixListPlus.tabs_detail
            //有四项，则在视图sys_role_mixListPlus_detail or sys_role_mixListPlus_tabs_detail中展示
            for (var viewGroupCode in entityConfig.detailViews) {
                var viewGroup = entityConfig.detailViews[viewGroupCode];
                for (var viewIndex in viewGroup) {

                    var detailViews = {};
                    if (viewGroup[viewIndex].templateData) {
                        //采用mustache的模板

                        var mustacheStateMapping = this.parser().parseAll(entityConfig.moduleName, entityConfig.entityName, entityConfig.list.view, viewGroupCode, viewGroup[viewIndex].fileName)
                        log(mustacheStateMapping);
                        console.debug("- mustacheUrl（采用）")
                        detailViews[mustacheStateMapping.view] = {templateProvider: function ($http) {
                            return tmpl_crud_view(mustacheStateMapping.mustacheUrl, $http, entityConfig)
                        }}
                        $stateProvider.state(mustacheStateMapping.state, { url: mustacheStateMapping.stateUrl, views: detailViews, controller: mustacheStateMapping.controller  })

                    } else {

                        //采用各模块中的自定义的angular模板文件，一般是为了自定义一些复杂或非常规的html页面
                        var htmlStateMapping = this.parser().parseAll(entityConfig.moduleName, entityConfig.entityName, entityConfig.list.view, viewGroupCode, viewGroup[viewIndex].fileName)
                        log(htmlStateMapping);
                        console.debug("- htmlUrl（采用）")
                        detailViews[htmlStateMapping.view] = { templateUrl: htmlStateMapping.htmlUrl }
                        $stateProvider.state(htmlStateMapping.state, { url: htmlStateMapping.stateUrl, views: detailViews, controller: htmlStateMapping.controller  })
                    }

                }
            }
        } catch (e) {
            console.error("设置state时出错!", entityConfig)
            console.error(e.stack)
        }
        console.debug("<<<#########end to parse entityConfig and set state#########<<<")

        function log(mapping) {
            console.debug(">>>mapping state>>", mapping.state)
            console.debug("- stateUrl:", mapping.stateUrl)
            console.debug("- view:", mapping.view)
            console.debug("- controller:", mapping.controller)
            console.debug("- htmlUrl:", mapping.htmlUrl + "   （若配置选用html则采用此url）")
            console.debug("- mustacheUrl:", mapping.mustacheUrl + "   （若配置选用mustache则采用此url）")
        }

        function checkEntityConfig(entityConfig) {
            var ec = entityConfig;
            if (!ec) {
                logErrorMsg('entityConfig不能为空');
                return false
            }
            else if (!ec.moduleName || !ec.entityName || !ec.list || !ec.detailViews) {
                logErrorMsg('entityConfig的属性moduleName、entityName、list、detailViews不能为空。');
                return false;
            } else {
                var viewIsOk = true;
                for (var viewTypeIndex in ec.detailViews) {
                    for (var viewIndex in ec.detailViews[viewTypeIndex]) {
                        var view = ec.detailViews[viewTypeIndex][viewIndex];
                        if (!view.title || !view.parentView || !view.fileName) {
                            logErrorMsg('detailViews[x]的属性title、parentView、fileName不能为空。', view);
                            viewIsOk = false;
                        }
                    }
                }
                if (!viewIsOk)return false;
                if (!ec.list.view) {
                    logErrorMsg("list", ec.list)
                }
            }
            return true;
        }

        /**
         * 设置entityConfig的默认值
         * @param entityConfig
         */
        function setDefault(entityConfig) {
            var defaultActions = {
                add: {name: '添加', target: 'inner', group: "tabs", view: 'detail', enable: true},
                delete: {name: '删除', target: 'inner', group: "none", view: 'none', enable: true},
                update: {name: '更新', target: 'inner', group: "tabs", view: 'detail', enable: true},
                read: {name: '查看', target: 'inner', group: "tabs", view: 'detail', enable: true},
                query: {name: '查询', target: 'inner', group: "none", view: 'list', enable: true}
            }
            if (!entityConfig.list.actions) {
                entityConfig.list.actions = {};
            }
            if (!entityConfig.list.actions.default) {
                entityConfig.list.actions.default = defaultActions;
            } else {
                if (!angular.isObject(entityConfig.list.actions.default)) {
                    console.error("entityConfig.list.actions.default必须为json对象格式。", entityConfig.list.actions.default)
                    return;
                }

                for (var defaultActionCode in defaultActions) {
                    var defaultAction = defaultActions[defaultActionCode]
                    var act = entityConfig.list.actions.default[defaultActionCode]
                    if (!act) {
                        entityConfig.list.actions.default[defaultActionCode] = defaultAction;
                    } else {
                        for (var p in defaultAction) {
                            var pv = entityConfig.list.actions.default[defaultActionCode][p];
                            entityConfig.list.actions.default[defaultActionCode][p] = angular.isString(pv) && pv.length > 0 || pv != undefined ? pv : defaultActions[defaultActionCode][p]
                        }
                    }
                }
            }
            console.debug(">>after list.actions.default set,the action.default is >>", entityConfig.list.actions.default)
            return entityConfig;
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
            },
            controller: 'sys'
        })
    }
//    this.state = $stateProvider.state;


    this.parser = function () {
        //命名规则!!!!
        var _state = "{{moduleName}}.{{entityName}}.{{listView}}.{{viewGroup}}_{{view}}"
        var _view = "{{moduleName}}_{{entityName}}_{{listView}}_{{viewGroup}}_{{view}}"
        //为了便于页面的重用、引用，将controller及htmlUrl中的viewGroup去掉，不做限定，以便于在多个viewGroup可共用
        var _controller = "{{moduleName}}_{{entityName}}_{{listView}}_{{view}}"
        var _htmlUrl = "m\\{{moduleName}}\\{{entityName}}\\{{listView}}_{{view}}.html"
        var _mustacheUrl = "m\\tmpl\\crud\\{{listView}}_{{viewGroup}}_{{view}}.mustache"

        this.parseAll = function (moduleName, entityName, listView, viewGroup, view) {
            var mapping = {};
            mapping.state = this.parseState(moduleName, entityName, listView, viewGroup, view);
            mapping.stateUrl = this.parseStateUrl(moduleName, entityName, listView, viewGroup, view);
            mapping.view = this.parseView(moduleName, entityName, listView, viewGroup, view);
            mapping.controller = this.parseController(moduleName, entityName, listView, viewGroup, view);
            mapping.htmlUrl = this.parseHtmlUrl(moduleName, entityName, listView, viewGroup, view);
            mapping.mustacheUrl = this.parseMustacheUrl(moduleName, entityName, listView, viewGroup, view);
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
            //特殊情况，针对listView,viewGroup,view都为空的场景，将“\.”替换为默认的index
            result = result.replace(/(\\\.)/g, "\\index.");
            return result;
        }

        this.parseStateUrl = function (moduleName, entityName, listView, viewGroup, view) {
            var stateName = this.parseState(moduleName, entityName, listView, viewGroup, view, _state)
            var flags = stateName.split(".");
            if (flags.length == 4)
                return "/" + flags[flags.length - 1] + "/:item"
            else return "/" + flags[flags.length - 1];
        }
        this.parseState = function (moduleName, entityName, listView, viewGroup, view) {
            return parse(moduleName, entityName, listView, viewGroup, view, _state)
        }
        this.parseView = function (moduleName, entityName, listView, viewGroup, view) {
            function replaceSign(str) {
                return str.replace(/(\.)/g, "_");
            }

            //基于stateName，以“.”进行替换，以免因传入参数中带“_”导致解析出错。
            var stateName = this.parseState(moduleName, entityName, listView, viewGroup, view, _state)
            //对于最长的detail state，如sys.user.mixListPlus.tabs_detail,其页面数据将在ui-view:sys_user_mixListPlus_tabs_detail展示
            if (view) {
                return replaceSign(stateName);
            }
            //对于一般的list state，如sys.user.mixListPlus，其页面数据将在ui-view:sys_user展示
            //对于最短的entity state，如sys.user，其页面数据将在ui-view sys展示
            //即都是取视图取上一级
            else if (listView || entityName) {
                return replaceSign(stateName.substring(0, stateName.lastIndexOf(".")))
            }
            console.error(">>>parseView>>>未支持该视图解析，对应state为：", stateName)
            return ""
        }
        this.parseController = function (moduleName, entityName, listView, viewGroup, view) {
            return parse(moduleName, entityName, listView, viewGroup, view, _controller)
        }
        this.parseHtmlUrl = function (moduleName, entityName, listView, viewGroup, view) {
            return parse(moduleName, entityName, listView, viewGroup, view, _htmlUrl)
        }
        this.parseMustacheUrl = function (moduleName, entityName, listView, viewGroup, view) {
            return parse(moduleName, entityName, listView, viewGroup, view, _mustacheUrl)
        }
        var parse = function (moduleName, entityName, listView, viewGroup, view, template) {
            var data = {
                moduleName: moduleName,
                entityName: entityName,
                listView: listView,
                viewGroup: viewGroup,
                view: view
            }
            return removeRedundantSign(Mustache.render(template, data))
        }

        return this;
    }


    //TODO 模板应是在打开app时加载，不应每次通过http再获取，可以降低接口的复杂度
    function tmpl_crud_view(mustacheTmplUrl, $http, config) {
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
