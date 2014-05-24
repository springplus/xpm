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
import org.xpm.entity.sys.Role;
import org.xpm.repository.mybatis.SysDao;
import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/role")
public class RoleRestController {

    private Logger logger = LoggerFactory.getLogger(RoleRestController.class);

    @Autowired
    private BaseDao<Role> baseDao;

    @Autowired
    private SysDao sysDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(Role.class);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public Role findOne(@PathVariable("id") Long id) {
        return baseDao.findOne(Role.class, id);
    }


    @RequestMapping(value = {"","/*"},method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public Role save(@RequestBody Role role) {
        return baseDao.save(role);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(Role.class, id);
    }


}
