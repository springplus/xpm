package org.xpm.rest.metadata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.sqlProvider.Param;
import org.xpm.entity.metadata.LogicEntity;
import org.xpm.entity.metadata.LogicField;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/md/logicEntity")
public class LogicEntityRestController extends BaseRestController<LogicEntity> {
    private static Logger logger = LoggerFactory.getLogger(LogicEntityRestController.class);

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(LogicEntity.class);
    }


    @Override
    protected Class<LogicEntity> getEntityType() {
        return LogicEntity.class;
    }


    public void delete(@PathVariable("id") String id, @RequestParam Map map) {
        baseDao.delete(new Param(LogicField.class).put("logicEntityId", id), new Param(LogicEntity.class).put("id", id));
    }
}
