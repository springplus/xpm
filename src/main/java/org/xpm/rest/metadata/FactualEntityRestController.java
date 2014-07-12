package org.xpm.rest.metadata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.web.MediaTypes;
import org.xpm.repository.mybatis.FactualEntityDao;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/md/factualEntity")
public class FactualEntityRestController {

    @Autowired
    private FactualEntityDao factualEntityDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return factualEntityDao.query();
    }

//    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//    @ResponseBody
//    public List list(){
//        return utilsDao.queryForList(null);
//    }
}
