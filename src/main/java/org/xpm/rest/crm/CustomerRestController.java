package org.xpm.rest.crm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.mvc.BaseRestController;
import org.xpm.entity.sys.App;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-5-2.
 */
@Controller
@RequestMapping(value = "/api/sys/customer")
public class CustomerRestController extends BaseRestController<App>{

    private static Logger logger = LoggerFactory.getLogger(CustomerRestController.class);


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
