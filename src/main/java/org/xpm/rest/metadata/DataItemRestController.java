package org.xpm.rest.metadata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.core.orm.mybatis.sqlProvider.Param;
import org.xpm.entity.DataItem;
import org.xpm.entity.EnumValue;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/data_item")
public class DataItemRestController {
    private Logger logger = LoggerFactory.getLogger(DataItemRestController.class);

    @Autowired
    private BaseDao baseDao;

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("data_item_catalog_id") String data_item_catalog_id) {
        return baseDao.find(DataItem.class, "data_item_catalog_id", data_item_catalog_id);
    }

    @RequestMapping(method = RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
    public DataItem save(@RequestBody DataItem dataItem) {
        return (DataItem)baseDao.save(dataItem);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id, @RequestParam("code") String code) {
        baseDao.delete(new Param(EnumValue.class).put("dataItemCode", code),new Param(DataItem.class).put("id", id));
    }
}
