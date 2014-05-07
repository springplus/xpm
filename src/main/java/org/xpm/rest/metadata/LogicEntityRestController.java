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

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/logic_entity")
public class LogicEntityRestController {
    private static Logger logger = LoggerFactory.getLogger(LogicEntityRestController.class);
    @Autowired
    private BaseDao baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<LogicEntity> list(){
        return baseDao.find(LogicEntity.class);
    }

    @RequestMapping(method = RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
    public ResponseEntity<?> create(@RequestBody LogicEntity logicEntity, UriComponentsBuilder uriBuilder) {
        logger.debug("logicEntity",logicEntity);
//        logicEntityDao.save((LogicEntity) EntityUtils.fillBeforeSave(logicEntity));
        logicEntity = (LogicEntity) baseDao.save(logicEntity);

        // 按照Restful风格约定，创建指向新任务的url, 也可以直接返回id或对象.
        URI uri = uriBuilder.path("/api/logic_entity/" + logicEntity.getId()).build().toUri();
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(uri);

        return new ResponseEntity(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(LogicEntity.class,id);
    }
}
