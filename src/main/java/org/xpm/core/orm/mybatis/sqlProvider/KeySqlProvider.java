package org.xpm.core.orm.mybatis.sqlProvider;

import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.session.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xpm.core.cache.CacheNames;
import org.xpm.core.cache.GuavaCacheManager;

import java.util.concurrent.ExecutionException;

/**
 * Created by hongxq on 2014/6/28.
 * 基于数据库中的sqlKey配置，找到相应的语句
 */
public class KeySqlProvider {

    private static Logger logger = LoggerFactory.getLogger(KeySqlProvider.class);

    public String find(QueryParam param) throws ExecutionException {

        String sql = param.getSqlParsed();//GuavaCacheManager.Instance().getCache(CacheNames.CACHENAME_SQLCONFIG).get(param.getSqlKey()).toString();
        if ("".equals(sql) || sql == null) {
            logger.error("未对sqlKey:{}配置sql语句。", param.getSqlKey());
        } else if (param.getQueryFields() != null && param.getQueryFields().length() > 0) {
            StringBuilder sb = new StringBuilder();
            sb.append("select ");
            sb.append(param.getQueryFields());
            sb.append(" from (");
            sb.append(sql);
            sb.append(") as t");
            sql = sb.toString();
        }
        return sql;
    }


}
