<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.apache.shiro.web.filter.authc.FormAuthenticationFilter" %>
<%@ page import="org.apache.shiro.authc.ExcessiveAttemptsException" %>
<%@ page import="org.apache.shiro.authc.IncorrectCredentialsException" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<html>
<head>
    <title>登录页</title>
    <!-- Standard Meta -->
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <!-- Site Properities -->
    <title>XPM for creative team</title>
    <link rel="stylesheet" type="text/css" href="${ctx}/static/css/semantic.css">
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
<body style="background-color:#ffffff">
<h1 class="ui inverted teal block header"></h1>

<div class="ui page grid">
    <div class="ui seven wide column" style="margin-top: 180px;padding-right:50px;text-align: right">
        <img src="${ctx}/static/images/m/logo.png" style="width:240px;height:73px;">

        <p>改善工作环境，为创造性团队。</p>
    </div>

    <div class="ui eight wide column" style="margin-top: 130px;">
        <%
            String error = (String) request.getAttribute(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME);
            if (error != null) {
                error="error";
            }else{
                error="";
            }
        %>
        <form id="loginForm"  action="${ctx}/login" method="post" class="ui ${error} form segment" style="width: 400px">
            <div class="ui error message">
                <p>登录失败，请重试.</p>
            </div>
            <div class="field">
                <label>账号</label>

                <div class="ui left icon input">
                    <input type="text" id="username" name="username" placeholder="账号名称或邮箱" required/>
                    <i class="user icon"></i>

                    <div class="ui corner label">
                        <i class="asterisk icon"></i>
                    </div>
                </div>
            </div>
            <div class="field">
                <label>密码</label>

                <div class="ui left icon input">
                    <input type="password" id="password" name="password" placeholder="六位以上密码" required/>
                    <i class="lock icon"></i>

                    <div class="ui corner label">
                        <i class="asterisk icon"></i>
                    </div>
                </div>
            </div>
            <div class="inline field">
                <div class="ui checkbox">
                    <input type="checkbox" id="rememberMe" name="rememberMe">
                    <label for="rememberMe">记住密码两周</label>
                    <span style="margin-left: 70px;margin-right:10px;cursor: pointer"
                          onclick="alert('忘记密码?')">忘记密码?</span>
                    <span style="cursor: pointer" onclick="window.location.href='${ctx}/register'">没有账号?</span>
                </div>
            </div>
            <div class="inline field">
                <i class="sign in icon"></i>
                <input id="submit_btn" class="ui teal icon button" type="submit" value="登 录"/>
            </div>
        </form>

    </div>
</div>
</body>
<script>
    $(document).ready(function () {
        $("#loginForm").validate();
    });


</script>
</html>
