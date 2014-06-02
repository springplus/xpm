package org.xpm.core.orm.mybatis.sqlProvider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.xpm.core.orm.mybatis.ColumnFieldMapping;
import org.xpm.core.orm.mybatis.MetaData;
import org.xpm.core.orm.mybatis.MetaDataManager;

import java.util.Iterator;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-25.
 * mybatis的*Provider只支持一个参数，故需将参数封装到*Param中
 */
@Component
public class QuerySqlProvider {
    private static Logger logger = LoggerFactory.getLogger(SaveSqlProvider.class);

    private MetaDataManager metaDataManager = new MetaDataManager();

    public String find(Class clazz) {
        MetaData md = metaDataManager.get(clazz);
        SimpleQuerySqlBuilder msb = new SimpleQuerySqlBuilder();
        if (md.getTableName() == null)
            throw new RuntimeException("Gen selectSQL fail for tableName is null. Class is " + clazz.getName());
        msb.SELECT(md.getTableName(),getRenamedSelectFields(clazz));
        String sql = msb.toSql();
        if (logger.isDebugEnabled())
            logger.debug(sql);
        return sql;
    }

    /**
     * mybatis的selectProvider只支持一个参数
     *
     * @param param
     * @return
     */
    public String findByType(Param param) {
        MetaData md = metaDataManager.get(param.getEntityType());
        SimpleQuerySqlBuilder msb = new SimpleQuerySqlBuilder();
        msb.SELECT(md.getTableName(),getRenamedSelectFields(param.getEntityType()));
        Iterator<Map.Entry> it = param.getValues().entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry entry = it.next();
            ColumnFieldMapping cfm = md.getColumnFieldMapping(entry.getKey().toString());
            if (cfm == null) {
                throw new RuntimeException("对于" + param.getEntityType() + "，通过" + entry.getKey() + "找不到ColumnFieldMapping，可能是查询参数字段与实体中影射的数据库字段不相同导致。");
            }
            msb.CONDITIONS(cfm.getColumnName(), "values." + cfm.getFieldName(), "#");
        }
        String sql = msb.toSql();
        if (logger.isDebugEnabled())
            logger.debug(sql);
        return sql;
    }

//    public String findOneByEntity(EntityParam param) {
//        MetaData md = metaDataManager.get(param.getEntityType());
//        SimpleQuerySqlBuilder msb = new SimpleQuerySqlBuilder();
//        msb.SELECT_ONE(md.getTableName());
//        //如果有设置了参数，则以参数为准进行查询
//        //如果未设置参数，则不附加条件进行查询
//        if(param.isPutParam()){
//            for(String field:param.getParams()){
//                msb.CONDITIONS(field, "entity."+field, "#");
//            }
//        }
//        String sql = msb.toSql();
//        if (logger.isDebugEnabled())
//            logger.debug(sql);
//        return sql;
//    }


    /**
     * @param param
     * @return
     */
    public String findOneByType(Param param) {
        MetaData md = metaDataManager.get(param.getEntityType());
        SimpleQuerySqlBuilder msb = new SimpleQuerySqlBuilder();
        msb.SELECT_ONE(md.getTableName());
        Iterator<Map.Entry> it = param.getValues().entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry entry = it.next();
            ColumnFieldMapping cfm = md.getColumnFieldMapping(entry.getKey().toString());
            msb.CONDITIONS(cfm.getColumnName(), "values." + cfm.getFieldName(), "#");
        }
        String sql = msb.toSql();
        if (logger.isDebugEnabled())
            logger.debug(sql);
        return sql;
    }


    private String getRenamedSelectFields(Class clazz) {
        MetaData md = metaDataManager.get(clazz);
        StringBuilder sb = new StringBuilder();
        for (ColumnFieldMapping cfm : md.getColumnNames()) {
            if (cfm.isEquals()) {
                sb.append(cfm.getColumnName());
            } else {
                sb.append(cfm.getColumnName());
                sb.append(" ");
                sb.append(cfm.getFieldName());
            }
            sb.append(",");
        }
        if (sb.length() > 0)
            sb.deleteCharAt(sb.length() - 1);
        return sb.toString();
    }
}
