package org.xpm.rest.metadata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.EnumValue;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/enum_value")
public class EnumValueRestController {

    @Autowired
    private BaseDao baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("data_item_code") String data_item_code) {
        return baseDao.find(EnumValue.class,"data_item_code", data_item_code);
    }

    @RequestMapping(method = RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<EnumValue> save(@RequestBody List<EnumValue> enumValues){
        return baseDao.save(enumValues);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        baseDao.delete(EnumValue.class,id);
    }
}
