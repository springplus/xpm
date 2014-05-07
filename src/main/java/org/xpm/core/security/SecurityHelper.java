package org.xpm.core.security;

import org.apache.shiro.SecurityUtils;
import org.xpm.service.sys.ShiroDbRealm;

/**
 * Created by hongxueqian on 14-4-12.
 */
public class SecurityHelper {

    public static ShiroDbRealm.ShiroUser getCurrentUser(){
        return (ShiroDbRealm.ShiroUser) SecurityUtils.getSubject().getPrincipal();
    }

    public static Long getCurrentUserId(){
        ShiroDbRealm.ShiroUser user = (ShiroDbRealm.ShiroUser) SecurityUtils.getSubject().getPrincipal();
        return user==null?null:user.id;
    }

    public static boolean hasRole(String roleIdentifier){
        return SecurityUtils.getSubject().hasRole(roleIdentifier);
    }

    public static boolean isPermitted(String permission){
        return SecurityUtils.getSubject().isPermitted(permission);
    }
}
