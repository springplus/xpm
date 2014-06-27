package org.xpm.rest.project;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.mvc.BaseRestController;
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
public class ProjectRestController extends BaseRestController<Project> {
    private static Logger logger = LoggerFactory.getLogger(ProjectRestController.class);

    @Override
    protected Class<Project> getEntityType() {
        return Project.class;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(Project.class);
    }


    /**
     * 只支持单个项目级级联删除
     * @param ids
     * @param map
     */
    public void delete(@PathVariable("id") String ids, @RequestParam Map map) {
        Long id = Long.parseLong(ids);
        baseDao.delete(new Param(TeamMember.class).put("projectId", id), new Param(Milestone.class).put("projectId", id), new Param(Project.class).put("id", id));
    }
}
