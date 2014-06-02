package org.xpm.rest.metadata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.metadata.DataItemCatalog;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/dataItemCatalog")
public class DataItemCatalogRestController extends BaseRestController<DataItemCatalog>{

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(DataItemCatalog.class);
    }

    @Override
    protected Class<DataItemCatalog> getEntityType() {
        return DataItemCatalog.class;
    }
}
