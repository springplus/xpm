package org.xpm.core.orm.mybatis.sqlProvider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.xpm.core.orm.mybatis.ColumnFieldMapping;
import org.xpm.core.orm.mybatis.MetaData;
import org.xpm.core.orm.mybatis.MetaDataManager;
import org.xpm.core.orm.entity.IdEntity;
import org.xpm.core.orm.mybatis.sqlProvider.sqlBuilder.SimpleBatchInsertSqlBuilder;
import org.xpm.core.orm.mybatis.sqlProvider.sqlBuilder.SimpleInsertSqlBuilder;
import org.xpm.core.orm.mybatis.sqlProvider.sqlBuilder.SimpleUpdateSqlBuilder;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by hongxueqian on 14-3-23.
 */
@Component
public class SaveSqlProvider<T extends IdEntity, ID extends java.io.Serializable> {
    private static Logger logger = LoggerFactory.getLogger(SaveSqlProvider.class);

    private MetaDataManager metaDataManager = new MetaDataManager();

    /**
     * @param s
     * @param <S>
     * @return
     */
    public <S extends T> String save(S s) {
        if (s.getId() != null && s.getId() > 0)
            return update(s);
        return insert(s);
    }

    private <S extends T> String insert(S s) {
        MetaData md = metaDataManager.get(s.getClass());
        SimpleInsertSqlBuilder msb = new SimpleInsertSqlBuilder();
        msb.INSERT_INTO(md.getTableName());
        Iterator<ColumnFieldMapping> it = md.getColumnNames().iterator();
        while (it.hasNext()) {
            ColumnFieldMapping fcm = it.next();
            msb.VALUES(fcm.getColumnName(), fcm.getFieldName(), "#");
        }
        String sql = msb.toSql();
        logger.debug(sql);
        return sql;
    }

//    public String updateByType(Param param) {
//        MetaData md = metaDataManager.get(param.getEntityType());
//        SimpleUpdateSqlBuilder msb = new SimpleUpdateSqlBuilder();
//        msb.UPDATE(md.getTableName());
//        Iterator<ColumnFieldMapping> it = md.getColumnNames().iterator();
//        while (it.hasNext()) {
//            ColumnFieldMapping fcm = it.next();
//            //本次参数中带有的属性才需更新
//            if (param.containsField(fcm.getFieldName()))
//                //除了ID外，其它字段才可更新
//                if (fcm.getColumnName() != md.getId().getColumnName())
//                    msb.VALUES(fcm.getColumnName(), fcm.getFieldName(), "#");
//        }
//        msb.CONDITIONS(md.getId().getColumnName(), md.getId().getFieldName(), "#");
//        String sql = msb.toSql();
//        logger.debug(sql);
//        return sql;
//    }

    private <S extends T> String update(S s) {
        MetaData md = metaDataManager.get(s.getClass());
        SimpleUpdateSqlBuilder msb = new SimpleUpdateSqlBuilder();
        msb.UPDATE(md.getTableName());
        Iterator<ColumnFieldMapping> it = md.getColumnNames().iterator();
        while (it.hasNext()) {
            ColumnFieldMapping fcm = it.next();
            if (fcm.getColumnName() != md.getId().getColumnName())
                msb.VALUES(fcm.getColumnName(), fcm.getFieldName(), "#");
        }
        msb.CONDITIONS(md.getId().getColumnName(), md.getId().getFieldName(), "#");
        String sql = msb.toSql();
        logger.debug(sql);
        return sql;
    }


    /**
     * 批量保存，同时可以存新增及修改
     *
     * @param iterable
     * @param <S>
     * @return
     */
//    public <S extends T> String saveBatch(java.lang.Iterable<S> iterable) {
//        StringBuilder sql = new StringBuilder();
//        List<S> insertEntitys = new ArrayList<S>();
//        Iterator<S> it = iterable.iterator();
//        while (it.hasNext()) {
//            S s = it.next();
//            if (s.getId() != null && s.getId() > 0)
//                sql.append(update(s)).append(";");
//            else insertEntitys.add(s);
//        }
//        //同时存在插入的情况
//        if (insertEntitys.size() > 0) {
//            return sql.append(insertBatch(insertEntitys)).toString();
//        }
//        return sql.toString();
//    }
//
//    private <S extends T> String insertBatch(java.lang.Iterable<S> iterable) {
//        Iterator<S> it = iterable.iterator();
//        SimpleBatchInsertSqlBuilder sbisb = new SimpleBatchInsertSqlBuilder();
//        int index = 0;
//        MetaData md = null;
//        while (it.hasNext()) {
//            S s = it.next();
//            if (index == 0) {
//                md = metaDataManager.get(s.getClass());
//                sbisb.INSERT_INTO(md.getTableName());
//            }
//            index += 1;
//            Iterator<ColumnFieldMapping> columnFieldIt = md.getColumnNames().iterator();
//            SimpleBatchInsertSqlBuilder.EntityValues ev = sbisb.startOne();
//            while (columnFieldIt.hasNext()) {
//                ColumnFieldMapping fcm = columnFieldIt.next();
//                ev.VALUES(fcm.getColumnName(), fcm.getFieldName(), "#");
//            }
//        }
//        String sql = sbisb.toSql();
//        logger.debug(sql);
//        return sql;
//    }
}