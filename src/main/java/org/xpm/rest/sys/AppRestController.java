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
import org.xpm.entity.sys.App;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-5-2.
 */
@Controller
@RequestMapping(value = "/api/app")
public class AppRestController {

    private Logger logger = LoggerFactory.getLogger(AppRestController.class);

    @Autowired
    private BaseDao<App> baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(App.class);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public App findOne(@PathVariable("id") Long id){
        return baseDao.findOne(App.class,id);
    }

    @RequestMapping(value = {"","/*"},method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public App save(@RequestBody App app) {
        return baseDao.save(app);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(App.class, id);
    }


}
