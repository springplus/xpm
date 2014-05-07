package org.xpm.rest.project;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.Milestone;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-4-12.
 */
@Controller
@RequestMapping(value = "/api/milestone")
public class MilestoneRestController {
    private Logger logger = LoggerFactory.getLogger(MilestoneRestController.class);

    @Autowired
    private BaseDao<Milestone> baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("project_id") Long projectId) {
        return baseDao.find(Milestone.class,"projectId", projectId);
    }

    @RequestMapping(method = RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
    public Milestone save(@RequestBody Milestone milestone) {
        return baseDao.save(milestone);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(Milestone.class,id);
    }
}
