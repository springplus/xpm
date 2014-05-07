<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<html>
<head>
    <title>用户注册</title>
    <!-- Standard Meta -->
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <!-- Site Properities -->
    <title>XPM for creative team</title>
    <link rel="stylesheet" type="text/css" href="../../../static/css/semantic.css">
    <style>
        body {
            font-family: "Open Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
            background: #FFFFFF;
            margin: 0px;
            padding: 0px;
            color: #555555;
            text-rendering: optimizeLegibility;
            min-width: 320px;

        }
    </style>

</head>

<body>
<h1 class="ui inverted teal block header"></h1>

<div class="ui page grid">

    <div class="ui seven wide column" style="margin-top: 60px;padding-right:50px;text-align: right">
        <img src="../../../static/images/m/logo.png" style="width:240px;height:73px;">

        <p>改善工作环境，为创造性团队。</p>

        <div class="ui icon item">
            <i class="big green circular users link icon"></i>
            新手入门
        </div>
        <div class="ui icon  item">
            <i class="big green circular video link icon"></i>
            特性快照
        </div>
        <div class="ui icon item">
            <i class="big green circular browser link icon"></i>
            <label class="header">产品演示</label>
        </div>

    </div>

    <div class="ui eight wide column" style="margin-top: 60px;">
        <form id="inputForm" action="${ctx}/register" method="post" class="ui form segment" style="width: 400px">
            <div class="field">
                <label>账户名</label>

                <div class="ui left icon input">
                    <input type="text" id="loginName" name="loginName" placeholder="用于登录" required/>
                    <i class="user icon"></i>
                </div>
            </div>
            <div class="field">
                <label>密码</label>

                <div class="ui left icon input">
                    <input type="password" id="plainPassword" name="plainPassword" placeholder="六位以上密码" required/>
                    <i class="lock icon"></i>

                </div>
            </div>
            <div class="field">
                <label>确认密码</label>

                <div class="ui left icon input">
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="六位以上密码" required
                           equalTo="#plainPassword"/>
                    <i class="lock icon"></i>
                </div>
            </div>
            <div class="inline field">
                <div class="ui checkbox">
                    <input type="checkbox" id="conditions" name="conditions">
                    <label for="conditions">同意服务协议</label>
                    <span style="margin-left: 70px;margin-right:10px;cursor: pointer"
                          onclick="alert('查看协议')">查看协议</span>
                    <span style="cursor: pointer" onclick="window.location.href='${ctx}/login'">已有账号?</span>
                </div>
            </div>
            <div class="inline field">
                <input type="submit" class="ui teal icon button" value="注 册"/>
            </div>

        </form>
    </div>
</div>
</body>
<script language="javascript" src="${ctx}/static/js/jquery/jquery.js"></script>
<script language="javascript" src="${ctx}/static/ui/jquery-validation/1.11.1/jquery.validate.min.js"></script>
<script language="javascript" src="${ctx}/static/ui/jquery-validation/1.11.1/messages_bs_zh.js"></script>
<script>
    $(document).ready(function () {
        //聚焦第一个输入框
        $("#loginName").focus();
        //为inputForm注册validate函数
        $("#inputForm").validate({
            rules: {
                loginName: {
                    remote: "${ctx}/register/checkLoginName"
                }
            },
            messages: {
                loginName: {
                    remote: "用户登录名已存在"
                }
            }
        });
    });
</script>
</html>
