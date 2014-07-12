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
import org.xpm.entity.TeamMember;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-4-12.
 */
@Controller
@RequestMapping(value = "/api/prj/teamMember")
public class TeamMemberRestController extends BaseRestController<TeamMember>{
    private static Logger logger = LoggerFactory.getLogger(TeamMemberRestController.class);

    @Override
    protected Class<TeamMember> getEntityType() {
        return TeamMember.class;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("project_id") Long projectId) {
        return baseDao.find(TeamMember.class,"projectId",projectId);
    }

}
