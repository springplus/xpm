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
        try {
            parseInt("" + kv[1])
            eval("obj." + item);
        } catch (e) {
            eval("obj." + kv[0] + "=\"" + kv[1] + "\"");
        }
    })
    if (xgeeUtils.isInfo) {
        console.debug(">>>xgeeUtils.paramsToObject>>>params:", params)
        console.debug(">>>xgeeUtils.paramsToObject>>>obj:", obj)
    }
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
        console.error(">>xgeeUtils.format4View>>对象｛" + obj + "｝类型为" + (typeof obj) + ",不是Object类型，无法转换。")
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


xgeeUtils.factory('$$Data', ['$resource', function ($Resource) {
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
        }
    }
}]);

xgeeUtils.service('$$stateProxy', ['$state', '$xgeeRouter', function ($state, $xgeeRouter) {
    return {
        goto: function (state, objAsParams, location) {
            console.debug(">>>goto state>>", state);
//            console.debug(">>>item>>", xgeeUtils.objectToParams(state));
            var _location = false;
            if (location != undefined || location != null || location != "")_location = location
            $state.go(state, {item: xgeeUtils.objectToParams(objAsParams)}, {location: _location})
            //如果执行了以上的go操作，页面是空白的没有加载，需做如下检查：
            //1、state是否配置正常，config阶段的state\html\url\controller规划的值是否匹配
            //2、view页面（html或mustache）上的ng-controller配置是否正确
            //3、主view mustache文件中的ui-view是否有config阶段规划的值一致
        },
        parseState: function (moduleName, entityName, listView, viewGroup, view,templateDir) {
            return $xgeeRouter.parser().parseState(moduleName, entityName, listView, viewGroup, view,templateDir)
        },
        gotoState: function (moduleName, entityName, listView, viewGroup, view, objAsParams, location,templateDir) {
            this.goto($xgeeRouter.parser().parseState(moduleName, entityName, listView, viewGroup, view,templateDir), objAsParams, location);
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

