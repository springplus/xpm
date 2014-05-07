/**
 * Created by hongxueqian on 14-3-3.
 */
var appUtils = angular.module('appUtils', ['ngResource']);
appUtils.logLevel = "DEBUG";
appUtils.isDebug = (appUtils.logLevel == "DEBUG");
appUtils.isInfo = (appUtils.logLevel == "INFO");

appUtils.EVENT = {
    ngxListItemPreDelete: "ngxListItemPreDelete",
    ngxListItemDelete: "ngxListItemDelete",
    ngxListItemDeleted: "ngxListItemDeleted",
    ngxListItemClicked: "ngxListItemClicked"
}

/**
 * 将对象的所有属性转换成数组类型，通地数组元素的key可取属性名，数组元素的value可取属性值
 * @param obj
 * @param key
 * @param value
 * @returns {Array}
 */
appUtils.objectToArray = function (obj, key, value) {
    var result = []
    var key = key ? key : "key";
    var value = value ? value : "value";
    if (!obj)return result;
    for (var item in obj) {
        result.push({key: item, value: obj[item]})
    }
//    console.debug(">>>appUtils.objectToArray>>>",result)
    return result;
}

appUtils.objectToParams = function (obj) {
    var result = "";
    if (!obj)return result;
    for (var item in obj) {
        if (item.indexOf("$") != -1)continue
        result += item + "=" + obj[item] + "&"
    }
    result = result.substring(0, result.length - 1)
//    console.debug(">>>appUtils.objectToParams>>>", result)
    return result;
}

/**
 * 转换对象的属性命名格式ab_cd为abCd
 * 同时去掉带有特殊符号$的属性(特殊符号的属性只用于显示不需保存到服务端)
 * @input：如[Resource, ... Resource, $promise: Object, $resolved: true]
 */
appUtils.convertNames = function (input) {
    if (!angular.isArray(input)) {
        console.error("不是有效的数组，返回原对象！！")
        return input;
    }
    var results = [];
    for (var key in input) {
        if (key.indexOf("$") != -1)continue
        results.push(appUtils.convertName(input[key]));
    }
    return results;
}

/**
 * 格式化数据用于视图展示
 * 1、转换对象的属性命名格式ab_cd为abCd
 * 2、若属性中包括字符Date，则尝试转成日期格式yyyy-MM-dd，
 * @param data
 */
appUtils.format4View = function (obj,$filter) {
    if (!angular.isObject(obj)) {
        console.error(">>appUtils.format4View>>对象｛"+obj+"｝类型为"+(typeof obj)+",不是Object类型，无法转换。")
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
        }else{
            result[convertedName] = obj[item];
        }
//        console.debug(">>"+convertedName+">>",result[convertedName])
    }
    return result;
}

appUtils.format4Views = function (obj,$filter) {
    if (!angular.isArray(obj)) {
        console.error("不是有效的数组，返回原对象！！")
        return obj;
    }
    var results = [];
    for (var key in obj) {
        if (key.indexOf("$") != -1)continue
        results.push(appUtils.format4View(obj[key],$filter));
    }
    return results;
}


/**
 *  格式化数据用于持久化
 * @param data
 */
appUtils.format4Persistence = function (data) {

}


/**
 * 转换对象的属性命名格式ab_cd为abCd
 * 同时去掉带有特殊符号$的属性(特殊符号的属性只用于显示不需保存到服务端)
 * @param obj
 */
appUtils.convertName = function (obj) {
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

/**
 *
 * @param input url参数字符串；或resource
 * @returns {{}}
 */
appUtils.toObject = function (input) {
    if (angular.isString(input))
        return appUtils.paramsToObject(input);

    var result = {};
    if (!input)return result;
    for (var key in input) {
        if (key.indexOf("$") != -1)continue
        result[key] = input[key]
    }
//    console.debug(">>>appUtils.toObject>>>", result)
    return result;
}

/**
 * 将url参数字符串转成对象
 * @param params
 * @returns {{}}
 */
appUtils.paramsToObject = function (params) {
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
    if (appUtils.isInfo) {
        console.debug(">>>appUtils.paramsToObject>>>params:", params)
        console.debug(">>>appUtils.paramsToObject>>>obj:", obj)
    }
    return obj;
}


// jQuery插件。一个jQuery对象，而不是直接调用。
jQuery.fn.simulateKeyPress = function (character) {
    // 内部调用jQuery.event.trigger
    // 参数有 (Event, data, elem). 最后一个参数是非常重要的的！
//    console.debug({ type: 'keypress', which: character.charCodeAt(0) })
    jQuery(this).trigger({ type: 'keypress', which: character.charCodeAt(0) });
};


//-------------首页面上的提醒消息，在#msg上展示---------------//
appUtils.tipWarm = function (msg) {
    appUtils.tip(msg, "warning");
}
appUtils.tipInfo = function (msg) {
    appUtils.tip(msg, "info");
}
appUtils.tipSuccess = function (msg) {
    appUtils.tip(msg, "success");
}
appUtils.tipError = function (msg) {
    appUtils.tip(msg, "error");
}
appUtils.tip = function (msg, level) {
    var style = "ui info message";
    if (level == "warning")style = "ui warning message";
    if (level == "info")style = "ui info message";
    if (level == "success")style = "ui success message";
    if (level == "error")style = "ui error message";
    $('#msg')
        .popup('hide')
        .popup({
            html: "<div style='margin:0px; padding:3px' class='" + style + "'>" + msg + "</div>",
            position: 'bottom center',
            duration: 450
        }).popup('show', function () {
            setTimeout(function () {
                $('#msg').popup('hide');
            }, 750)
        })

}


//appUtils.evn = "WebStorm";
appUtils.evn = "Idea";
appUtils.ctx = "m/"
appUtils.service('$$MD', function () {
    return {
        evn: appUtils.evn,
        ctx: appUtils.ctx,
        loadPage: function ($scope, settings) {
            console.debug("loadPage>settings......");
            console.debug(settings);
            var template = settings.template;
            var target = settings.target;
            var params = settings.params;
            eval("$scope." + target + "='m/metadata/views/" + template + ".html?a=11'");
        },
        url: function (path) {
            var ext = ".json"
            if (appUtils.evn == "WebStorm") {
                appUtils.ctx = "m/"
            } else {
                appUtils.ctx = "http://localhost:6879"
                ext = "/:id"
            }
            console.debug(appUtils.ctx + path + ext)
            return appUtils.ctx + path + ext
        }
    }
})

var action = { 'get': {method: 'GET'},
    'save': {method: 'POST'},
    'saveBatch': {method: 'POST', isArray: true},
    'query': {method: 'GET', isArray: true},
//    'jsonp': {method: 'JSONP', isArray: true},
    'remove': {method: 'DELETE'},
    'delete': {method: 'DELETE'} };

var queryOnlyAction = { 'get': {method: 'GET'},
    'query': {method: 'GET', isArray: true}};


appUtils.factory('$$Data', ['$resource','$filter', '$$MD', function ($Resource,$filter, $$MD) {
    return {
        //**********提供通用的调用方式，以便于对传参，返回结果，异常情况，操作提醒进行统一处理,依赖于以下方的资源配置**********//
        query: function (resName, options,defaultResult,success, fail) {
            return this._ajax("query",resName, options,defaultResult,success, fail);
        }, get: function (resName, options,defaultResult,success, fail) {
            return this._ajax("get", resName, options,defaultResult,success, fail);
        },
        /**
         *
         * @param method
         * @param resName
         * @param options
         * @param defaultResult 如果结果为null则采用默认值
         * @param success
         * @param fail
         * @returns {*}
         * @private
         */
        _ajax: function (method, resName, options,defaultResult,success, fail) {
            if (!options)
                options = "";
            eval("this." + resName + "." + method + "(options)").$promise.then(function(result) {
                if(result==null)result=defaultResult;
                console.debug(">>"+method+" options>>", options);
                console.debug(">>"+method+" result>>", result);
                result = appUtils.format4View(result,$filter);
                console.debug(">>"+method+" result format>>", result);
                return result;
            });
        },
        //**********资源配置**********//
        //-----------m.metadata-----------//
        LogicEntity: $Resource($$MD.url("/api/logic_entity"), {id: "@id"}, action),
        LogicField: $Resource($$MD.url("/api/logic_field"), {}, action),
        FactualEntity: $Resource($$MD.url("/api/factual_entity"), {}, queryOnlyAction),
        DataItem: $Resource($$MD.url("/api/data_item"), {}, action),
        DataItemCatalog: $Resource($$MD.url("/api/data_item_catalog"), {}, action),
        DataItemEnum: $Resource($$MD.url("/api/data_item_enum"), {}, action),
        EnumValue: $Resource($$MD.url("/api/enum_value"), {}, action),
        //-----------m.project-----------//
        Project: $Resource($$MD.url("/api/project"), {id: "@id"}, action),

        //-----------m.sys-----------//
        App: $Resource($$MD.url("/api/app"), {}, action),
        User: $Resource($$MD.url("/api/user"), {}, action),
        Role: $Resource($$MD.url("/api/role"), {}, action),
        Permission: $Resource($$MD.url("/api/permission"), {}, action)

    }
}]);


