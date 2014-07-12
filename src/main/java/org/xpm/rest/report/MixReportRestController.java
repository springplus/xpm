package org.xpm.rest.report;

import com.google.common.cache.LoadingCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.cache.CacheNames;
import org.xpm.core.cache.GuavaCacheManager;
import org.xpm.core.orm.mybatis.BaseMybatisQueryDao;
import org.xpm.core.orm.mybatis.MybatisQueryDao;
import org.xpm.core.orm.mybatis.sqlParser.ParameterParser;
import org.xpm.core.orm.mybatis.sqlProvider.QueryParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by hongxq on 2014/6/28.
 * 提供基于mybatis select id的通用查询服务
 */
@Controller
@RequestMapping(value = "/api/rpt/mix")
public class MixReportRestController {

    private static Logger logger = LoggerFactory.getLogger(MixReportRestController.class);

    @Autowired
    private BaseMybatisQueryDao baseMybatisQueryDao;

    @RequestMapping(value = "/query/{sqlKey}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Map> list(@PathVariable("sqlKey") String sqlKey, @RequestParam Map map) {
//        LoadingCache cache = GuavaCacheManager.Instance().getCache(CacheNames.CACHENAME_SQLCONFIG);
        QueryParam queryParam = new QueryParam();
        queryParam.setSqlKey(sqlKey);
        queryParam.putAll(map);
        return baseMybatisQueryDao.find(queryParam);
    }

    @RequestMapping(value = "/helper/clearQueryCache/all", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public String clearQueryCache() {
        LoadingCache cache = GuavaCacheManager.Instance().getCache(CacheNames.CACHENAME_SQLCONFIG);
        long before = cache.size();
        cache.invalidateAll();
        long after = cache.size();
        return "cache.size:"+before+" --> clear --> cache.size:"+after;
    }

    @RequestMapping(value = "/helper/parseParameters", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public  List<HashMap<String,String>> parseParameters(@RequestBody String sql){
        return ParameterParser.parse(sql);
    }

}
