package org.xpm.rest.sys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.core.security.SecurityHelper;
import org.xpm.entity.sys.User;
import org.xpm.repository.mybatis.SysDao;
import org.xpm.rest.RestException;
import org.xpm.service.ServiceException;
import org.xpm.service.sys.ShiroDbRealm;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/user")
public class UserRestController {

    private Logger logger = LoggerFactory.getLogger(UserRestController.class);

    @Autowired
    private BaseDao<User> baseDao;

    @Autowired
    private SysDao sysDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(User.class);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public User findOne(@PathVariable("id") Long id) {
        //如果id<1或id==null，则表示取当前用户
        User u = null;
//        if (id == null || id < 1) {
//            Long uid = 1L; //TODO 未作登录功能，暂时先写成1 SecurityHelper.getCurrentUserId()
//            u = baseDao.findOne(User.class, uid);
//        } else {
//            if (SecurityHelper.hasRole("admin") || SecurityHelper.isPermitted("user:findOne:") || SecurityHelper.getCurrentUserId() == id) {
//                u = baseDao.findOne(User.class, id);
//            }
//        }
        u = baseDao.findOne(User.class, id);
//        throw new RestException("未登录");
        return u;
    }


    @RequestMapping(method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void save(@RequestBody User user) {
        User u = baseDao.findOne(User.class, user.getId());
        u.setName(user.getName());
        u.setDescription(user.getDescription());
        baseDao.save(u);
        //这里只修改用户名、描述信息
//        return "更新成功！";
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        if (id == 1) {
            logger.warn("操作员{}尝试删除超级管理员用户", SecurityHelper.getCurrentUser().loginName);
            throw new RestException("不能删除超级管理员用户");
        }
        //检查是否有权限删除该用户
        if (SecurityHelper.hasRole("admin") || SecurityHelper.isPermitted("user:delete:") || SecurityHelper.getCurrentUserId() == id) {
            sysDao.deleteUserById(id);
        } else {
            ShiroDbRealm.ShiroUser shiroUser = SecurityHelper.getCurrentUser();
            if (shiroUser != null)
                logger.warn("当前用户[" + SecurityHelper.getCurrentUser().getName() + "," + SecurityHelper.getCurrentUserId() + "]无权限删除帐号ID：" + id);
            else
                logger.warn("匿名用户无权限删除帐号ID：" + id);
            throw new RestException("无权限删除该用户！");
        }

    }


}
