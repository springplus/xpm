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
appUtils.format4View = function (obj, $filter) {
    if (!angular.isObject(obj)) {
        console.error(">>appUtils.format4View>>对象｛" + obj + "｝类型为" + (typeof obj) + ",不是Object类型，无法转换。")
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

appUtils.format4Views = function (obj, $filter) {
    if (!angular.isArray(obj)) {
        console.error("不是有效的数组，返回原对象！！")
        return obj;
    }
    var results = [];
    for (var key in obj) {
        if (key.indexOf("$") != -1)continue
        results.push(appUtils.format4View(obj[key], $filter));
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
//jQuery.fn.simulateKeyPress = function (character) {
//    // 内部调用jQuery.event.trigger
//    // 参数有 (Event, data, elem). 最后一个参数是非常重要的的！
////    console.debug({ type: 'keypress', which: character.charCodeAt(0) })
//    jQuery(this).trigger({ type: 'keypress', which: character.charCodeAt(0) });
//};


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
    var $tipMsg = $('#tipMsg');
    $tipMsg
        .popup('hide')
        .popup({
            html: "<div style='margin:0px; padding:3px' class='" + style + "'>" + msg + "</div>",
            position: 'bottom left',
            duration: 450
        }).popup('show', function () {
            setTimeout(function () {
                $tipMsg.popup('hide');
            }, 1250)
        })
}
//重新展示目前提醒控件中存在的信息
appUtils.tipReshow = function () {
    var $tipMsg = $('#tipMsg');
    console.debug(">>>>>>$tipMsg>>", $tipMsg);
    $tipMsg.popup('show', function () {
        setTimeout(function () {
            $tipMsg.popup('hide');
        }, 1250)
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
                ext = ""
            }
            console.debug(appUtils.ctx + path + ext)
            return appUtils.ctx + path + ext
        }
    }
})


appUtils.factory('$$Data', ['$resource', '$filter', '$$MD', function ($Resource, $filter, $$MD) {

    var action = { 'get': {method: 'GET'},
        'save': {method: 'POST'},
        'saveBatch': {method: 'POST', isArray: true},
        'query': {method: 'GET', isArray: true},
//    'jsonp': {method: 'JSONP', isArray: true},
        'remove': {method: 'DELETE'},
        'delete': {method: 'DELETE'} };
    var queryOnlyAction = { 'get': {method: 'GET'},
        'query': {method: 'GET', isArray: true}};
    return {
        //当url中已有:id时，{id:'@id'}这部分可以省略
        //-----------m.metadata-----------//
        logicEntity: $Resource($$MD.url("/api/logic_entity/:id"), {id: '@id'}, action),
        logicField: $Resource($$MD.url("/api/logic_field/:id"),{id: '@id'}, action),
        factualEntity: $Resource($$MD.url("/api/factual_entity/:id"), {id: '@id'}, queryOnlyAction),
        dataItem: $Resource($$MD.url("/api/data_item/:id"), {id: '@id'}, action),
        dataItemCatalog: $Resource($$MD.url("/api/data_item_catalog/:id"), {id: '@id'}, action),
        dataItemEnum: $Resource($$MD.url("/api/data_item_enum/:id"), {id: '@id'}, action),
        enumValue: $Resource($$MD.url("/api/enum_value/:id"), {id: '@id'}, action),
        //-----------m.project-----------//
        project: $Resource($$MD.url("/api/project/:id"), {id: '@id'}, action),

        //-----------m.sys-----------//
        app: $Resource($$MD.url("/api/app/:id"), {id: '@id'}, action),
        user: $Resource($$MD.url("/api/user/:id"), {id: '@id'}, action),
        role: $Resource($$MD.url("/api/role/:id"), {id: '@id'}, action),
        permission: $Resource($$MD.url("/api/permission/:id"), {id: '@id'}, action),
        //增加符号$，表示非实体
        $auth: $Resource($$MD.url("/api/auth"), {}, action)
    }
}]);


