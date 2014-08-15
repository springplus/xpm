/**
 * Created by hongxueqian on 14-3-3.
 */
var xgeeUtils = angular.module('xgeeUtils', ['ngResource']);
/**
 * 将对象的所有属性转换成数组类型，通地数组元素的key可取属性名，数组元素的value可取属性值
 * @param obj
 * @param key
 * @param value
 * @returns {Array}
 */
xgeeUtils.objectToArray = function (obj, key, value) {
    var result = []
    var key = key ? key : "key";
    var value = value ? value : "value";
    if (!obj)return result;
    for (var item in obj) {
        result.push({key: item, value: obj[item]})
    }
//    console.debug(">>>xgeeUtils.objectToArray>>>",result)
    return result;
}

/**
 * 将对象的所有属性转换成url参数字符串
 * 并且跳过带有$的属性
 * @param obj
 * @param key
 * @param value
 * @returns {Array}
 */
xgeeUtils.objectToParams = function (obj) {
    var result = "";
    if (!obj)return result;
    for (var item in obj) {
        if (item.indexOf("$") != -1)continue
        result += item + "=" + obj[item] + "&"
    }
    result = result.substring(0, result.length - 1)
//    console.debug(">>>xgeeUtils.objectToParams>>>", result)
    return result;
}


/**
 *
 * @param input url参数字符串；或resource
 * @returns {{}}
 */
xgeeUtils.toObject = function (input) {
    if (angular.isString(input))
        return xgeeUtils.paramsToObject(input);

    var result = {};
    if (!input)return result;
    for (var key in input) {
        if (key.indexOf("$") != -1)continue
        result[key] = input[key]
    }
//    console.debug(">>>xgeeUtils.toObject>>>", result)
    return result;
}

xgeeUtils.Url = (function () {


    return {
        parse: function (url) {
            var result = {}
            var segments = url.split("?");
//          var flags = segments[0].split("/");
//          var alias = flags[1]||flags[0]
            if (segments.length == 2) {
                result.params = xgeeUtils.paramsToObject(segments[1])
            }
            result.params = result.params || {}
            result.path = segments[0];
            return result;
        }
    }
})()

/**
 * 将url参数字符串转成对象
 * @param params
 * @returns {{}}
 */
xgeeUtils.paramsToObject = function (params) {
    var obj = {};
    if (!params)return obj;
    params.split("&").forEach(function (item) {
        var kv = item.split("=");
//        try {
//            parseInt("" + kv[1])
//            eval("obj." + item);
//        } catch (e) {
//            eval("obj." + kv[0] + "=\"" + kv[1] + "\"");
//        }
        try {
            //TODO 值中有换行符时出错 SyntaxError: Unexpected token ILLEGAL
            eval("obj." + kv[0] + "=\"" + kv[1] + "\"");
        } catch (e) {
            console.error("", e.stack);
        }
    })
//    console.debug(">>>xgeeUtils.paramsToObject>>>params:", params)
//    console.debug(">>>xgeeUtils.paramsToObject>>>obj:", obj)
    return obj;
}


/**
 * 用于将列表中的字段描成字符串，主要用于id的拼接
 * @param ary
 * @param linkField 默认为"id"
 * @param linkFlag 默认为“,”
 * @returns {string}
 */
xgeeUtils.linkArrayToString = function (ary, linkField, linkFlag) {
    var result = ""
    if (!linkField)linkField = "id";
    if (!linkFlag)linkFlag = ",";
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] && ary[i][linkField]) {
            result += ary[i][linkField];
            if (i != ary.length - 1)
                result += linkFlag
        }
    }
    return result
}


/**
 * 转换对象的属性命名格式ab_cd为abCd
 * 同时去掉带有特殊符号$的属性(特殊符号的属性只用于显示不需保存到服务端)
 * @input：如[Resource, ... Resource, $promise: Object, $resolved: true]
 */
xgeeUtils.convertNames = function (input) {
    if (!angular.isArray(input)) {
        console.error("不是有效的数组，返回原对象！！")
        return input;
    }
    var results = [];
    for (var key in input) {
        if (key.indexOf("$") != -1)continue
        results.push(xgeeUtils.convertName(input[key]));
    }
    return results;
}

/**
 * 格式化数据用于视图展示
 * 1、转换对象的属性命名格式ab_cd为abCd
 * 2、去掉属性名称前缀
 * 3、若属性中包括字符Date，则尝试转成日期格式yyyy-MM-dd
 * @param obj
 * @param propertyPreSigns 若属性名称中存在表头，如sys_ md_ prj_ ...
 */
xgeeUtils.format4View = function (obj, $filter, propertyPreSigns) {
    if (!angular.isObject(obj)) {
        console.info(">>xgeeUtils.format4View>>对象｛" + obj + "｝类型为" + (typeof obj) + ",不是Object类型，无法转换。")
        return obj;
    }
    var result = {};
    for (var item in obj) {
        if (item.indexOf("$") != -1)continue;
        var nameParts = item.split("_");
        var convertedName = nameParts[0];
        for (var i = 1; i < nameParts.length; i++) {
            convertedName += nameParts[i].charAt(0).toUpperCase() + nameParts[i].substring(1)
        }
        if (convertedName.indexOf("Date") != -1) {
            result[convertedName] = $filter('date')(obj[item], 'yyyy-MM-dd');
        } else {
            result[convertedName] = obj[item];
        }
//        console.debug(">>"+convertedName+">>",result[convertedName])
    }
    return result;
}

xgeeUtils.format4Views = function (obj, $filter) {
    if (!angular.isArray(obj)) {
        console.error("不是有效的数组，返回原对象！！")
        return obj;
    }
    var results = [];
    for (var key in obj) {
        if (key.indexOf("$") != -1)continue
        results.push(xgeeUtils.format4View(obj[key], $filter));
    }
    return results;
}


/**
 *  格式化数据用于持久化
 * @param data
 */
xgeeUtils.format4Persistence = function (data) {

}

/**
 * 转换对象的属性命名格式ab_cd为abCd
 * 同时去掉带有特殊符号$的属性(特殊符号的属性只用于显示不需保存到服务端)
 * @param obj
 */
xgeeUtils.convertName = function (obj) {
    if (!angular.isObject(obj)) {
        console.error("不是Object类型，无法转换。")
        return obj;
    }
    var result = {};
    for (var item in obj) {
        if (item.indexOf("$") != -1)continue;
        var nameParts = item.split("_");
        var convertedName = nameParts[0];
        for (var i = 1; i < nameParts.length; i++) {
            convertedName += nameParts[i].charAt(0).toUpperCase() + nameParts[i].substring(1)
        }
        result[convertedName] = obj[item];
    }
    return result;
}


//-------------首页面上的提醒消息，在#msg上展示---------------//
xgeeUtils.tipWarm = function (msg) {
    xgeeUtils.tip(msg, "warning");
}
xgeeUtils.tipInfo = function (msg) {
    xgeeUtils.tip(msg, "info");
}
xgeeUtils.tipSuccess = function (msg) {
    xgeeUtils.tip(msg, "success");
}
xgeeUtils.tipError = function (msg) {
    xgeeUtils.tip(msg, "error");
}
xgeeUtils.tip = function (msg, level) {
    var style = "ui info message";
    if (level == "warning")style = "ui warning message";
    if (level == "info")style = "ui info message";
    if (level == "success")style = "ui success message";
    if (level == "error")style = "ui error message";
    var $tipMsg = $('#tipMsg');
    $tipMsg
        .popup('hide')
        .popup({
            html: "<div style='margin:0px; padding:3px' class='" + style + "'>" + msg + "</div>",
            position: 'bottom left',
            duration: 450
//        }).popup('show')
        }).popup('show', function () {
            setTimeout(function () {
                $tipMsg.popup('hide')
            }, 1250)
        })
}
//重新展示目前提醒控件中存在的信息
xgeeUtils.tipReshow = function () {
    var $tipMsg = $('#tipMsg');
    console.debug(">>>>>>$tipMsg>>", $tipMsg);
    $tipMsg.popup('show', function () {
        setTimeout(function () {
            $tipMsg.popup('hide');
        }, 1250)
    })
}

xgeeUtils.xql = {
    cmds: {
        res: {param: ['sqlKey']},
        dict: {param: ['keys']},
        form: {param: ['key']},
        entity: {param: ['key']},
        jsonFile: {param: ['dir', 'file']}
    },
    parse: function (xqlStr) {
        var cmdSplitFlag = ":";
        var paramSplitFlag = " ";

        var cmd_params = xqlStr.split(cmdSplitFlag);
        if (cmd_params.length != 2)throw new Error("格式有误，" + xqlStr + "按“" + cmdSplitFlag + "”分割之后长度应为2。");

        var paramValues = cmd_params[1].split(paramSplitFlag)
        var paramNames = xgeeUtils.xql.cmds[cmd_params[0]].param;
        var params = {};
        var index = 0
        for (var i in paramValues) {
            //去掉空split出来的空值情况，如有多个空值进行split时
            if (!paramValues[i])continue
            params[paramNames[index]] = paramValues[i];
            index++;
        }


        var result = {
            xql: xqlStr,
            key: cmd_params[0] + "_" + paramValues[0],
            cmd: cmd_params[0],
            params: params
        }
        return result;
    }
}


xgeeUtils.factory('$$Data', ['$resource', '$http', function ($Resource, $http) {
    var self = this;
    var entityDict = {}
    return {
        action: {
            'get': {method: 'GET'},
            'save': {method: 'POST'},
            'saveBatch': {method: 'POST', isArray: true},
            'query': {method: 'GET', isArray: true},
            //'jsonp': {method: 'JSONP', isArray: true},
            'remove': {method: 'DELETE'},
            'delete': {method: 'DELETE'},
            'deleteBatch': {method: 'DELETE'}
        },
        queryOnlyAction: {
            'get': {method: 'GET'},
            'query': {method: 'GET', isArray: true}
        },
        batchSaveOnlyAction: {
            saveBatch: {method: 'POST', isArray: true}
        },
        //------------一些通用的数据、文件服务
        res: $Resource("/api/rpt/mix/query/:sqlKey", {sqlKey: '@sqlKey'}, {'query': {method: 'GET', isArray: true}}),
        reportHelper: $Resource("/api/rpt/mix/helper/parseParameters", {}, {'parse': {method: 'POST', isArray: true}}),
        dict: $Resource("/api/md/mix/dict/:keys", {keys: '@keys'}, {'query': {method: 'GET', isArray: true}}),
        /**
         * @param resKey  eg:"ui.viewConfig"
         * @returns {instance of $Resource}
         */
        entity: function (resKey) {
            if (!entityDict[resKey]) {
                var segments = resKey.split(".");
                entityDict[resKey] = $Resource("/api/" + segments[0] + "/" + segments[1] + "/:id", {id: '@id'}, this.action)
            }
            return entityDict[resKey];
        },
        jsonFile: {
            get: function (params, successFn, errorFn) {
                successFn = successFn || function () {
                }
                errorFn = errorFn || function () {
                }
                console.debug(">>params>>", params)
                return $http.get("m/api/data/" + params.dir + "/" + params.file + ".json").success(successFn).error(errorFn);
            }
        },
        xqlBind: function (options, successFn, errorFn) {
            var dataItemCfg = options.dataItemCfg;
            var toObject = options.toObject;
            if (dataItemCfg.xql) {
                var xqlConfig = xgeeUtils.xql.parse(dataItemCfg.xql);
                //TODO 同一个KEY 存在不同参数的情况
                //@default:
                if (!dataItemCfg.bindTo)console.error("未设置bindTo,dataItemCfg:", dataItemCfg)
                var bindTo = dataItemCfg.bindTo || xqlConfig.key;
                console.debug(">>bindTo:" + bindTo + " >> toObject:", toObject);

                var appForm = null;
                //TODO 实现form的$$Data.query
                if (xqlConfig.cmd == "form" || xqlConfig.cmd == "entity")
                    toObject[bindTo] = appForm
                else if (xqlConfig.cmd == "jsonFile") {
                    var promise = this.jsonFile.get(xqlConfig.params, function (data, status) {
//                        console.debug(">>promise", promise)
                        console.debug(">>jsonFile.get > " + xqlConfig.xql + " > ", data)
                        toObject[bindTo] = data;
                        if (angular.isFunction(successFn))successFn(data, status)
                    }, errorFn)

                } else {
                    toObject[bindTo] = this[xqlConfig.cmd].query(xqlConfig.params, successFn)
                }
//                    console.debug(">>>xqlConfig.cmd>>>", xqlConfig.cmd == "form" || xqlConfig.cmd == "entity")
            }


        }

    }
}]);

xgeeUtils.service('$$stateProxy', ['$state', '$xgeeRouter', function ($state, $xgeeRouter) {
    return {
        state: $state,
        goto: function (state, objAsParams, location) {
            console.debug(">>>goto state>>", state);
//            console.debug(">>>item>>", xgeeUtils.objectToParams(state));
            var _location = false;
            if (location != undefined || location != null || location != "")_location = location
            $state.go(state, {item: xgeeUtils.objectToParams(objAsParams)}, {location: _location})
            //如果执行了以上的go操作，页面是空白的没有加载，需做如下检查：
            //1、state是否配置正常，config阶段的state\html\url\controller规划的值是否匹配
            //2、view页面（html或template）上的ng-controller配置是否正确
            //3、主view template文件中的ui-view是否有config阶段规划的值一致
        },
        parseState: function (moduleName, entityName, listView, viewGroup, view, templateDir) {
            return $xgeeRouter.parser().parseState(moduleName, entityName, listView, viewGroup, view, templateDir)
        },
        gotoState: function (moduleName, entityName, listView, viewGroup, view, objAsParams, location, templateDir) {
            this.goto($xgeeRouter.parser().parseState(moduleName, entityName, listView, viewGroup, view, templateDir), objAsParams, location);
        },
        enum: {
            targetTypes: {
                INNER: "inner",
                SELF: "self",
                MODAL: "modal"
            }, innerViewTypes: {
                TABS: "tabs",
                STEPS: "steps",
                NONE: "none"
            }, containers: {
                TABS: "tabs",
                STEPS: "steps",
                NONE: "none"
            }, actions: {
                CREATE: "create",
                RETRIEVE: "retrieve",
                UPDATE: "update",
                DELETE: "delete"
            }
        }
    }
}])

xgeeUtils.viewHelper = {
    BaseViewCtrl: function ($scope, $$Data) {
        var self = this;
        var $scope = $scope;
        var $$Data = $$Data;

        this.setOwner = function (owner) {
            self.owner = owner;
            return this;
        }

        this.extend = function (addon) {
            if (angular.isObject(addon)) {
                for (var pName in addon) {
                    eval("self." + pName + "=" + addon[pName])
                }
            } else {
                console.debug(">>>addon需为Object格式");
            }
            return this;
        }
    }
}

/**
 * 不能直接用于ng-repeat上的数据，需在ng-repeat前进行过程，如下：
 * <div ng-init="itemListGroup = itemList | toGroup:4"></div>
 */
xgeeUtils.filter("toGroup", function () {
    return function (ary, numPerGroup) {
//        console.info(">>ary>", ary)
//        if (!ary||!angular.isArray(ary))return ary;
//        var newAry = angular.copy(ary)
        if(!ary)return []
        var newAry = ary;
        var groupAry = []
        var groupIndex = -1;
        for (var i = 0; i < newAry.length; i++) {
            if (i % numPerGroup == 0) {
                groupIndex++;
                groupAry.push([])
            }
            groupAry[groupIndex].push(newAry[i]);
        }
//        console.info(">>groupAry>", groupAry)
        return groupAry;
    }
});