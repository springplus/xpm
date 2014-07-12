package org.xpm.rest.metadata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.mvc.MapWrapper;
import org.xpm.core.orm.mybatis.MybatisQueryDao;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.core.orm.mybatis.sqlProvider.QueryParam;
import org.xpm.entity.metadata.LogicEntity;
import org.xpm.entity.metadata.LogicField;
import org.xpm.repository.mybatis.LogicFieldBaseMybatisCurdDao;
import org.xpm.rest.RestException;
import org.xpm.utils.EntityUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by hongxq on 2014/6/1.
 * 在资源的一般CRUD不能处理时，一些特殊的操作通过该模块通用的资源服务来解决
 * 如：批量保存、批量删除等
 */
@Controller
@RequestMapping(value = "/api/md/mix")
public class MixMetadataRestController {

    @Autowired
    private BaseDao baseDao;

    @Autowired
    private MybatisQueryDao mybatisQueryDao;

    @Autowired
    private LogicFieldBaseMybatisCurdDao logicFieldMybatisDao;

    @Autowired
    private BaseDao<LogicEntity> logicEntityBaseDao;

    @RequestMapping(value = "/dict/{dictKey}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@PathVariable("dictKey") String dictKey) {
        //dictKey: prj_project_type
        //sqlKey: prj_find_dataItem   //code=prj_project_type
        if (dictKey != null) {
            String[] flags = dictKey.split("_");
            if (flags.length == 3) {
                Map map = new HashMap(1);
                map.put("code",dictKey);
                QueryParam queryParam = new QueryParam();
                queryParam.setSqlKey("md_find_dataItem");
                queryParam.putAll(map);
                return mybatisQueryDao.find(queryParam);
            }
        }
        throw new RestException(HttpStatus.BAD_REQUEST, "参数dictKey格式有误，正确如：prj_project_type，当前值为" + dictKey);

    }


    @RequestMapping(value = {"/batchSaveLogicField"}, method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<LogicField> batchSaveLogicField(@RequestBody List<LogicField> logicFieldList) {
        return baseDao.save(logicFieldList);
    }


    @RequestMapping(value = {"/importFieldsByLogicEntityId"}, method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void importFieldsByLogicEntityId(@RequestBody Map map) {
        LogicEntity logicEntity = logicEntityBaseDao.findOne(LogicEntity.class, MapWrapper.wrap(map).getLong("id"));
        logicFieldMybatisDao.importFields((LogicEntity) EntityUtils.fillBeforeSave(logicEntity));
    }


}
