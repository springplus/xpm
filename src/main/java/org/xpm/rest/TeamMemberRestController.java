package org.xpm.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.TeamMember;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-4-12.
 */
@Controller
@RequestMapping(value = "/api/teamMember")
public class TeamMemberRestController {
    private Logger logger = LoggerFactory.getLogger(TeamMemberRestController.class);

    @Autowired
    private BaseDao<TeamMember> baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("project_id") Long projectId) {
        return baseDao.find(TeamMember.class,"projectId",projectId);
    }

    @RequestMapping(method = RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
    public TeamMember save(@RequestBody TeamMember teamMember) {
        return baseDao.save(teamMember);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(TeamMember.class,id);
    }
}
