package org.xpm.rest.metadata;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.entity.metadata.EnumValue;
import org.xpm.core.mvc.BaseRestController;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/md/enumValue")
public class EnumValueRestController extends BaseRestController<EnumValue>{

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@RequestParam("dataItemCode") String dataItemCode) {
        return baseDao.find(EnumValue.class,"dataItemCode", dataItemCode);
    }

    @Override
    protected Class<EnumValue> getEntityType() {
        return EnumValue.class;
    }
}
