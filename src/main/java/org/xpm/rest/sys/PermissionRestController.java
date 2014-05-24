package org.xpm.rest.sys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.sys.Permission;
import org.xpm.entity.sys.Role;
import org.xpm.repository.mybatis.SysDao;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/permission")
public class PermissionRestController {

    private Logger logger = LoggerFactory.getLogger(PermissionRestController.class);

    @Autowired
    private BaseDao<Permission> baseDao;

    @Autowired
    private SysDao sysDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(Permission.class);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public Permission findOne(@PathVariable("id") Long id) {
        return baseDao.findOne(Permission.class, id);
    }


    @RequestMapping(value = {"","/*"},method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public Permission save(@RequestBody Permission permission) {
        return baseDao.save(permission);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(Permission.class, id);
    }


}
