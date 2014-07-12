package org.xpm.rest.metadata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.mvc.MapWrapper;
import org.xpm.core.orm.mybatis.sqlProvider.Param;
import org.xpm.entity.metadata.DataItem;
import org.xpm.entity.metadata.EnumValue;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/md/dataItem")
public class DataItemRestController extends BaseRestController<DataItem> {
    private static Logger logger = LoggerFactory.getLogger(DataItemRestController.class);

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam(value="dataItemCatalogId",required = false) String dataItemCatalogId) {
        return baseDao.find(DataItem.class, "dataItemCatalogId", dataItemCatalogId);
    }

    public void delete(@PathVariable("id") String id, @RequestParam Map map) {
        baseDao.delete(new Param(EnumValue.class).put("dataItemCode", MapWrapper.wrap(map).getString("code")), new Param(DataItem.class).put("id", id));
    }

    @Override
    protected Class<DataItem> getEntityType() {
        return DataItem.class;
    }
}
