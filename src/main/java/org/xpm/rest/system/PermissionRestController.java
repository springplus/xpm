package org.xpm.rest.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.entity.sys.Permission;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/sys/permission")
public class PermissionRestController extends BaseRestController<Permission>{

    private static Logger logger = LoggerFactory.getLogger(PermissionRestController.class);

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(Permission.class);
    }

    @Override
    protected Class<Permission> getEntityType() {
        return Permission.class;
    }

}
