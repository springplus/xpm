package org.xpm.rest.sys;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.utils.Encodes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.core.security.SecurityHelper;
import org.xpm.entity.sys.User;
import org.xpm.rest.RestException;
import org.xpm.service.ServiceException;
import org.xpm.service.sys.ShiroDbRealm;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by hongxq on 2014/5/10.
 */
@Controller
@RequestMapping(value = "/api/auth")
public class AuthRestController {

    @Autowired
    private BaseDao<User> baseDao;

    @Autowired
    private ShiroDbRealm shiroDbRealm;

    private Logger logger = LoggerFactory.getLogger(AuthRestController.class);

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public User login(@RequestBody User user) {
        Subject currentUser = SecurityUtils.getSubject();
        if (!currentUser.isAuthenticated()) {
            //collect user principals and credentials in a gui specific manner
            //such as username/password html form, X509 certificate, OpenID, etc.
            //We'll use the username/password example here since it is the most common.
            //(do you know what movie this is from? ;)
            UsernamePasswordToken token = new UsernamePasswordToken(user.getLoginName(),user.getPassword());
            //this is all you have to do to support 'remember me' (no config - built in!):
            token.setRememberMe(true);
            try {
                currentUser.login(token);
                //if no exception, that's it, we're done!
                logger.info("User [" + currentUser.getPrincipal() + "] logged in successfully.");
            } catch (UnknownAccountException uae) {
                //username wasn't in the system, show them an error message?
                throw new RestException(HttpStatus.BAD_REQUEST,"无效的用户名！");
            } catch (IncorrectCredentialsException ice) {
                //password didn't match, try again?
                throw new RestException(HttpStatus.BAD_REQUEST,"无效的密码！");
            } catch (LockedAccountException lae) {
                //account for that username is locked - can't login.  Show them a message?
                throw new RestException(HttpStatus.BAD_REQUEST,"用户账号已被锁！");
            } catch (AuthenticationException ae) {
                //unexpected condition - error?
                throw new RestException(HttpStatus.BAD_REQUEST,"登录失败！[" + ae.getMessage() + "]");
            }
        }
        user = baseDao.findOne(User.class, "loginName", user.getLoginName());
        user.setSalt("");
        user.setPassword("");
        user.setPlainPassword("");
        return user;
    }

    @RequestMapping(value = "/isLogged")
    @ResponseBody
    public User isLogged() {
        if (SecurityHelper.isAuthenticatedForCurrentUser()) {
            User user = baseDao.findOne(User.class, SecurityHelper.getCurrentUserId());
            user.setSalt("");
            user.setPassword("");
            user.setPlainPassword("");
            return user;
        }
        return null;
    }

    @RequestMapping(value = "/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        if(!SecurityHelper.isAuthenticatedForCurrentUser()){
            logger.info("No User to logout.");
            return;
        }
        String name = SecurityHelper.getCurrentUser().getName();
        Subject currentUser = SecurityUtils.getSubject();
        currentUser.logout();
        logger.info("User [" + name+ "] logout in successfully.");
    }

    public void regideter() {

    }
}
