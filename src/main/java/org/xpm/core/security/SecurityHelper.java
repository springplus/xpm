package org.xpm.core.security;

import org.apache.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.xpm.service.sys.ShiroDbRealm;

import javax.servlet.ServletContext;

/**
 * Created by hongxueqian on 14-4-12.
 */
public class SecurityHelper {

    private static Logger logger = LoggerFactory.getLogger(SecurityHelper.class);

    public static ShiroDbRealm.ShiroUser getCurrentUser() {
        ShiroDbRealm.ShiroUser user = (ShiroDbRealm.ShiroUser) SecurityUtils.getSubject().getPrincipal();

        //开发环境中，若未登录可默认返回管理员，以便于可通过webstorm站点访问idea站点中的服务
        String profile = System.getProperty("spring.profiles.active");
        logger.debug("spring.profiles.active:{}", profile);
        if (profile != null && profile.toLowerCase().equals("development")) {
            if (user == null)
                user = new ShiroDbRealm.ShiroUser(1L, "admin@devEvn", "管理员@开发环境");
        }
        return user;
    }

    public static Long getCurrentUserId() {
        ShiroDbRealm.ShiroUser user = getCurrentUser();
        return user == null ? null : user.id;
    }

    public static boolean hasRole(String roleIdentifier) {
        return SecurityUtils.getSubject().hasRole(roleIdentifier);
    }

    public static boolean isPermitted(String permission) {
        return SecurityUtils.getSubject().isPermitted(permission);
    }

}
