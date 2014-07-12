package org.xpm.rest.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.entity.sys.App;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-5-2.
 */
@Controller
@RequestMapping(value = "/api/sys/app")
public class AppRestController extends BaseRestController<App>{

    private static Logger logger = LoggerFactory.getLogger(AppRestController.class);


    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(App.class);
    }

    @Override
    protected Class<App> getEntityType() {
        return App.class;
    }
}
