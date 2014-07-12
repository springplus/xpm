package org.xpm.rest.report;

import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.cache.CacheNames;
import org.xpm.core.cache.GuavaCacheManager;
import org.xpm.core.mvc.BaseRestController;
import org.xpm.entity.report.SqlConfig;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value = "/api/rpt/sqlConfig")
public class SqlConfigRestController extends BaseRestController<SqlConfig> {

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list() {
        return baseDao.find(SqlConfig.class);
    }

    public SqlConfig save(@RequestBody SqlConfig entity) {
        LoadingCache cache = GuavaCacheManager.Instance().getCache(CacheNames.CACHENAME_SQLCONFIG);
        SqlConfig result = baseDao.save(entity);
        cache.refresh(result.getSqlKey());
        return result;
    }

    @Override
    protected Class<SqlConfig> getEntityType() {
        return SqlConfig.class;
    }
}
