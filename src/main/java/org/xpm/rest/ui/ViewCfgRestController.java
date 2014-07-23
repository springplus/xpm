package org.xpm.rest.ui;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.mvc.BaseRestController;
import org.xpm.entity.sys.App;
import org.xpm.entity.ui.ViewCfg;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-5-2.
 */
@Controller
@RequestMapping(value = "/api/ui/viewCfg")
public class ViewCfgRestController extends BaseRestController<ViewCfg>{

    private static Logger logger = LoggerFactory.getLogger(ViewCfgRestController.class);


    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(ViewCfg.class);
    }

    @Override
    protected Class<ViewCfg> getEntityType() {
        return ViewCfg.class;
    }
}
