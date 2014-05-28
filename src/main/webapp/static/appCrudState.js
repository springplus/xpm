/**
 * Created by hongxq on 2014/5/26.
 */

appUtils.provider('$$appState', function $$appStateProvider($stateProvider) {

    this.setEntityCrudState = function (entityConfig) {
        console.debug(">>>entityConfig>>>",entityConfig)
        //检查数据是否正常
        if (!checkEntityConfig(entityConfig)) {
            console.error(">>>数据格式不符合要求>>>未setPromiseCrudState,entityConfig:", entityConfig);
            return;
        }

        var indexState = entityConfig.moduleName + '.' + entityConfig.entityName;
        var listState = indexState + "." + entityConfig.list.view;

        $stateProvider.state(indexState, { url: genUrl(indexState), views: genView(indexState), controller: genController(indexState) })
        log(indexState);
        $stateProvider.state(listState, {url: genUrl(listState), views: genView(listState), controller: genController(listState)})
        log(listState);
        for (var detailView in entityConfig.detailViews) {
            var detailState = listState + "." + entityConfig.detailViews[detailView].fileName;
            $stateProvider.state(detailState, {url: genUrl(detailState), views: genView(detailState), controller: genController(detailState)})
            log(detailState);
        }

        function log(stateName) {
            console.debug(stateName + " >> url:       ", genUrl(stateName))
            console.debug(stateName + " >> controller:", genController(stateName))
            console.debug(stateName + " >> views:     ", genView(stateName))
        }

        function genView(stateName) {
            var views = {};
            var flags = stateName.split(".");
            var viewName = "";
            var moduleName = flags.length > 0 ? flags[0] : "";
            var entityName = flags.length > 1 ? flags[1] : "";
            var listName = flags.length > 2 ? flags[2] : "";
            var detailName = flags.length > 3 ? flags[3] : "";

            //eg：sys.role，flags有两项，则在父级中的视图sys中展示
            if (flags.length == 2) {
                viewName = moduleName;
                views[viewName] = {templateProvider: function ($http) {
                    return tmpl_crud_view('index', $http, entityConfig)
                }}
            }
            //eg: sys.role.mixListPlus flags有三项，则在父级中的视图sys_role中展示
            else if (flags.length == 3) {
                viewName = moduleName + "_" + entityName;

                views[viewName] = {templateProvider: function ($http) {
                    console.debug(">>>viewName>>>",viewName)
//                    console.debug(">>>entityConfig>>>",entityConfig)
                    return tmpl_crud_list_view($http, entityConfig)
                }}
            }
            //eg: sys.role.mixListPlus.detail有四项，则在父级中的视图sys_role_mixListPlus_detail中展示
            //这里的视图不是sys_role_mixListPlus，是由于这一级是最后一级，不再嵌套子页面，且有场景是展示同级页面，如详情Tab页面
            else if (flags.length == 4) {
                viewName = moduleName + "_" + entityName + "_" + listName + "_" + detailName;
                var detailView;
                for(var view in entityConfig.detailViews){
                    if(entityConfig.detailViews[view].fileName==detailName){
                        detailView=entityConfig.detailViews[view]
                        break;
                    }
                }
                //console.debug(">>>detailView>>>", detailView);
                if (detailView.templateData) {
                    //采用mustache的模板
                    views[viewName] = {templateProvider: function ($http) {
                        var entity = entityConfig;
//                        var config = {moduleName:entity.moduleName,entityName:entity.entityName,detailView:detailView}
                        return tmpl_crud_view(listName + "_" + detailName, $http, entityConfig)
                    }}
                } else {
                    //采用各模块中的自定义的angular模板文件，一般是为了自定义一些复杂或非常规的页面
                    views[viewName] = { templateUrl: "m/" + moduleName + "/" + entityName + "/" + listName + "_" + detailName + ".html" }
                }
            }
            else console.warn(">>>未支持该状态的解析>>>", state);
            return views;
        }

        function genUrl(stateName) {
            //url会依据state名称进行继承，这里只需取最后的部分即可
            var flags = stateName.split(".");
            if (flags.length == 4)
                return "/" + flags[flags.length - 1] + "/:item"
            else return "/" + flags[flags.length - 1];
        }

        function genController(stateName) {
            //controller的名称与state的名称一致，将点号换成“_”。
            return stateName.replace(new RegExp("\\.", "g"), "_");
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
                for (var viewIndex in ec.detailViews) {
                    var view = ec.detailViews[viewIndex];
                    if (!view.title || !view.parentView || !view.fileName) {
                        logErrorMsg('detailViews[x]的属性title、parentView、fileName不能为空。', view);
                        viewIsOk = false;
                    }
                }
                if (!viewIsOk)return false;
                if (!ec.list.view) {
                    logErrorMsg("list", ec.list)
                }
            }
            return true;
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
    this.state = $stateProvider.state;

    this.$get = function(){return this};
})
