package org.xpm;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.xpm.core.cache.CacheNames;
import org.xpm.core.cache.GuavaCacheManager;
import org.xpm.entity.report.SqlConfig;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.core.orm.mybatis.MetaDataManager;
import org.xpm.core.orm.mybatis.sqlProvider.Param;

import javax.persistence.EntityManager;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class AppContext {
    private static Logger logger = LoggerFactory.getLogger(AppContext.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private MetaDataManager metaDataManager;

    @Autowired
    private BaseDao baseDao;

    public AppContext() {
    }

    public void init() {
        entityManager.setFlushMode(FlushModeType.COMMIT);
        logger.info("Set entityManger flushModeType to COMMIT.");

        metaDataManager.scanAndParse("org.xpm.entity");
        logger.info("Scan and parse entity metadata for mybatis.");

        initCache();
    }

    public void initCache() {
        LoadingCache<String, String> sqlCache = CacheBuilder.newBuilder()
                .maximumSize(10000)  //缓存队列最大长度
//                .expireAfterAccess(10, TimeUnit.MILLISECONDS) //缓存时效
                .build(new CacheLoader<String, String>() {
                    //信息获取策略 当缓存队列没有或者过期移除了此结果，从第三方重新获取getKeyFromU为第三方方法
                    @Override
                    public String load(String key) throws Exception {
                        SqlConfig sqlConfig = (SqlConfig) baseDao.findOne(SqlConfig.class, Param.map("sqlKey", key));
                        if (sqlConfig != null) return sqlConfig.getContent();
                        logger.error("从数据库中找不到sqlKey:{}对应的记录。", key);
                        return "";
                    }
                });
        getGuavaCacheManager().putCache(CacheNames.CACHENAME_SQLCONFIG, sqlCache);
    }

    public static GuavaCacheManager getGuavaCacheManager(){
        return GuavaCacheManager.Instance();
    }

}
