package org.xpm.rest.sys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.entity.sys.Role;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/role")
public class RoleRestController extends BaseRestController<Role>{

    private Logger logger = LoggerFactory.getLogger(RoleRestController.class);

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(Role.class);
    }

    @Override
    protected Class<Role> getEntityType() {
        return Role.class;
    }
}
