package org.xpm.rest.project;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.core.orm.mybatis.sqlProvider.Param;
import org.xpm.entity.Milestone;
import org.xpm.entity.Project;
import org.xpm.entity.TeamMember;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/project")
public class ProjectRestController {
    private Logger logger = LoggerFactory.getLogger(ProjectRestController.class);

    @Autowired
    private BaseDao baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(Project.class);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    public Project save(@RequestBody Project project) {
        return (Project) baseDao.save(project);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(new Param(TeamMember.class).put("projectId", id), new Param(Milestone.class).put("projectId", id), new Param(Project.class).put("id", id));
    }
}
