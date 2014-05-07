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
 * Created by hongxueqian on 14-3-30.
 */
@Component
public class DeleteSqlProvider<T, ID extends java.io.Serializable> {
    private static Logger logger = LoggerFactory.getLogger(SaveSqlProvider.class);

    private MetaDataManager metaDataManager = new MetaDataManager();

    /**
     * TODO：1、怎么控制哪些字段需要保存，哪些不需要保存；2、生成的SQL语句怎么缓存起来，以提高性能
     *
     * @param
     * @param <S>
     * @return
     */
//    public <S extends T> String delete(S s) {
//        MetaData md = metaDataProvider.get(s.getClass());
//        SimpleDeleteSqlBuilder msb = new SimpleDeleteSqlBuilder();
//        msb.DELETE(md.getTableName());
//        Iterator<ColumnFieldMapping> it = md.getColumnNames().iterator();
//        while (it.hasNext()) {
//            ColumnFieldMapping fcm = it.next();
//            msb.VALUES(fcm.getColumnName(), fcm.getFieldName(), "#");
//        }
//        String sql = msb.toSql();
//        logger.debug(sql);
//        return sql;
//    }

    public <S extends T>String deleteByType(Param deleteParam){
        MetaData md = metaDataManager.get(deleteParam.getEntityType());

        SimpleDeleteSqlBuilder msb = new SimpleDeleteSqlBuilder();
        msb.DELETE(md.getTableName());
        Iterator<Map.Entry<String,Object>> iterator = deleteParam.getValues().entrySet().iterator();
        while (iterator.hasNext()){
            Map.Entry<String,Object> entry = iterator.next();
            ColumnFieldMapping cfm = md.getColumnFieldMapping(entry.getKey());
            if(cfm!=null){
                //values. 是deleteParam内的参数属性，需带上。
                msb.VALUES(cfm.getColumnName(), "values."+cfm.getFieldName(), "#");
            }
        }
        String sql = msb.toSql();
        logger.debug(sql);
        return sql;
    }

    public <S extends T> String delete(S s) {
        MetaData md = metaDataManager.get(s.getClass());

        SimpleDeleteSqlBuilder msb = new SimpleDeleteSqlBuilder();
        msb.DELETE(md.getTableName());
        msb.VALUES(md.getId().getColumnName(), md.getId().getFieldName(), "#");
        String sql = msb.toSql();
        logger.debug(sql);
        return sql;
    }

    public <S extends T> String deleteAll(S s) {
        MetaData md = metaDataManager.get(s.getClass());
        SimpleDeleteSqlBuilder msb = new SimpleDeleteSqlBuilder();
        msb.DELETE(md.getTableName());
        msb.VALUES("1", "1");
        String sql = msb.toSql();
        logger.debug(sql);
        return sql;
    }
}
