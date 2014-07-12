package org.xpm.core.orm.mybatis;

import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.parsing.XNode;
import org.apache.ibatis.parsing.XPathParser;
import org.apache.ibatis.scripting.xmltags.DynamicSqlSource;
import org.apache.ibatis.scripting.xmltags.SqlNode;
import org.apache.ibatis.scripting.xmltags.XMLScriptBuilder;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.xpm.core.cache.CacheNames;
import org.xpm.core.cache.GuavaCacheManager;
import org.xpm.core.orm.mybatis.sqlProvider.QueryParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by hongxq on 2014/7/6.
 */
@Component
public class BaseMybatisQueryDao {

    private static Logger logger = org.slf4j.LoggerFactory.getLogger(BaseDao.class);

    @Autowired
    private SqlSessionFactory sqlSessionFactory;
    @Autowired
    private MybatisQueryDao mybatisQueryDao;


    public List<Map> find(QueryParam param) {
        Configuration configuration = sqlSessionFactory.getConfiguration();
        if (configuration == null) configuration = new Configuration();
        String sqlToParse = "";
        try {
            sqlToParse = GuavaCacheManager.Instance().getCache(CacheNames.CACHENAME_SQLCONFIG).get(param.getSqlKey()).toString();

        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
        if ("".equals(sqlToParse) || sqlToParse == null) {
            logger.error("未对sqlKey:{}配置sql语句。", param.getSqlKey());
        }
        param.setSqlParsed(parseSql(configuration, sqlToParse, param));
        //TODO 改成在这里直接执行，而不是通过sqlProvider，高效一些
        return mybatisQueryDao.find(param);
    }

    private String parseSql(Configuration configuration, String sqlToParse, HashMap<String, String> params) {
        StringBuilder sb = new StringBuilder();
        sb.append("<select>");
        sb.append(sqlToParse);
        sb.append("</select>");
        logger.debug("sqlToParse:{}", sb.toString());
//        logger.debug("sqlToParse:{}", sqlToParse);
        XPathParser xPathParser = new XPathParser(sb.toString());
        XNode selectNode = xPathParser.evalNode("/select");//evalNode,需要指定标签名
        XMLScriptBuilder xmlScriptBuilder = new XMLScriptBuilder(configuration, selectNode);
        BoundSql boundSql = xmlScriptBuilder.parseScriptNode().getBoundSql(params);
        return boundSql.getSql();
    }
}
