package org.xpm.rest.metadata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.LogicEntity;
import org.xpm.entity.LogicField;
import org.xpm.repository.mybatis.LogicFieldBaseMybatisCurdDao;
import org.xpm.utils.EntityUtils;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/logic_field")
public class LogicFieldRestController {

    @Autowired
    private LogicFieldBaseMybatisCurdDao logicFieldMybatisDao;
    @Autowired
    private BaseDao<LogicField> baseDao;


    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("logic_entity_id") String logic_entity_id) {

        return baseDao.find(LogicField.class,"logic_entity_id", logic_entity_id);
    }

    @RequestMapping(value={"","/*"},method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void importFields(@RequestBody LogicEntity logicEntity) {
        logicFieldMybatisDao.importFields((LogicEntity) EntityUtils.fillBeforeSave(logicEntity));
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(LogicField.class,id);
    }
}
