package org.xpm.rest.metadata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.LogicEntity;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/logic_entity")
public class LogicEntityRestController {
    private static Logger logger = LoggerFactory.getLogger(LogicEntityRestController.class);
    @Autowired
    private BaseDao<LogicEntity> baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(){
        return baseDao.find(LogicEntity.class);
    }

    @RequestMapping(value = {"","/*"},method = RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
    public LogicEntity save(@RequestBody LogicEntity logicEntity) {
        return baseDao.save(logicEntity);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(LogicEntity.class,id);
    }
}
