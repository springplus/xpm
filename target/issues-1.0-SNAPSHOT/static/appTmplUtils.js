/**
 * Created by hongxq on 2014/5/24.
 * 简单的文本模板解析工具
 */

//模板示例
//<script type="text/plain-cmd">
//    <cmd repeat="tabName in tabNames">
//        <div class='ui divided inbox selection list active tab' ng-switch-when="{{tabName}}"></div>
//    </cmd>
//</script>

appUtils.TmplUtils = function () {
//    this.parse = function (tmplSegment) {
//        var scriptSegments = parseScriptSegments(tmplSegment);
//        console.debug(scriptSegments);
//        if(scriptSegments!=null){
//            for(var scriptSegment in scriptSegments){
//                var cmdSegments = parseCmdSegments(scriptSegment);
//                console.debug(cmdSegments);
//            }
//        }
//    }
    /**
     * 支持的命令有：repeat
     */
//    function cmd() {
//        this.startAt;
//        this.endAt;
//        this.name;
//        this.content;
//    }

    function parseAndReplace(str,data){
        var objE = document.createElement("div");
        objE.innerHTML = tmplSegment;
    }

    this.render = function(str,data){
        var scriptSegments = parseScriptSegments(str);
    }

    function parseScriptSegments(str, startAt, parsedScriptSegments) {
        //TODO 需考虑type与script之间的空格
        if (startAt == undefined || startAt == "")startAt = 0;
        if (parsedScriptSegments == undefined) parsedScriptSegments = new Array();
        var scriptSegmentStartAt = str.indexOf("<script type=\"text/x-mustache\">", startAt)
        if (scriptSegmentStartAt != -1) {
            var scriptSegmentEndAt = str.indexOf("</script>", scriptSegmentStartAt);
            if (scriptSegmentEndAt != -1) {
                var scriptSegment = str.substring(scriptSegmentStartAt, scriptSegmentEndAt);
                console.debug("parsedScriptSegments == undefined",parsedScriptSegments== undefined);
                parsedScriptSegments.push(scriptSegment);
                parseScriptSegments(tmplSegment, scriptSegmentEndAt, parsedScriptSegments)
            }
        }
        return parsedScriptSegments
    }

    function parseCmdSegments(scriptSegment, startAt, parsedCmdSegments) {
        //TODO 需考虑type与script之间的空格
        if (startAt == undefined || startAt == "")startAt = 0;
        if (parsedCmdSegments == undefined)parsedCmdSegments = new Array();
        var cmdSegmentStartAt = scriptSegment.indexOf("<cmd ", startAt)

        if (cmdSegmentStartAt != -1) {
            var cmdSegmentEndAt = scriptSegment.indexOf("</script>", cmdSegmentStartAt);
            if (cmdSegmentEndAt != -1) {
                var cmdSegment = scriptSegment.substring(cmdSegmentStartAt, cmdSegmentEndAt);
                parsedCmdSegments.push(cmdSegment);
                parseScriptSegments(scriptSegment, cmdSegmentEndAt, parsedCmdSegments)
            }
        }
        return parsedCmdSegments
    }


    //    <cmd repeat="tabName in tabNames">
    //        <div class='ui divided inbox selection list active tab' ng-switch-when="{{tabName}}"></div>
    //    </cmd>
    function cmd_repeat(cmd) {
        this.cmd = cmd;
        this.toString = function (values) {

        }
    }
}

