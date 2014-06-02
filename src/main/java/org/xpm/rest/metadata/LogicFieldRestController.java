package org.xpm.rest.metadata;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.entity.metadata.LogicField;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/logicField")
public class LogicFieldRestController extends BaseRestController<LogicField> {

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("logic_entity_id") String logic_entity_id) {
        List<Map> list = baseDao.find(LogicField.class, "logicEntityId", logic_entity_id);
        return list;
    }


    @Override
    protected Class<LogicField> getEntityType() {
        return LogicField.class;
    }





}
