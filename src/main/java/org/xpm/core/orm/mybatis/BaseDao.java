package org.xpm.core.orm.mybatis;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.xpm.core.orm.mybatis.sqlProvider.Param;
import org.xpm.core.orm.entity.BaseEntity;
import org.xpm.core.orm.entity.IdEntity;
import org.xpm.utils.EntityUtils;

import java.util.*;

/**
 * Created by hongxueqian on 14-4-2.
 */
@Component
public class BaseDao<T extends IdEntity> {
    private static Logger logger = org.slf4j.LoggerFactory.getLogger(BaseDao.class);

    @Autowired
    private SqlSessionFactory sqlSessionFactory;

    @Autowired
    private MetaDataManager metaDataManager;

    public <S extends T> List<S> save(List<S> list) {
        Iterator<S> iterator = list.iterator();
        SqlSession sqlSession = sqlSessionFactory.openSession();
        try {
            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
            while (iterator.hasNext()) {
                S s = iterator.next();
                if (s instanceof BaseEntity)
                    EntityUtils.fillBeforeSave((BaseEntity) s);
                if (s.getId() == null) {
                    Long id = dao.save(s);
                    logger.debug("新增后ID为：" + s.getId());
                } else {
                    Long id = dao.save(s);
                    logger.debug("更新成功,影响记录数为：" + id);
                }
            }
            sqlSession.commit(true);
        } catch (Exception e) {
            if (sqlSession != null)
                sqlSession.rollback();
            throw new RuntimeException("批量保存出错！", e);
        } finally {
            if (sqlSession != null) sqlSession.close();
        }
        return list;
    }

    /**
     * 更新指定的字段
     * <p/>
     * 字段参数中必须有id字段
     */
//    public void update(Param param) {
//        SqlSession sqlSession = sqlSessionFactory.openSession();
//        try {
//            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
//            dao.update(param);
//            sqlSession.commit(true);
//        } catch (Exception e) {
//            throw new RuntimeException("保存出错！", e);
//        } finally {
//            if (sqlSession != null) sqlSession.close();
//        }
//    }
    public <S extends T> S save(S s) {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        try {
            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
            if (s instanceof BaseEntity)
                EntityUtils.fillBeforeSave((BaseEntity) s);
            if (s.getId() == null) {
                dao.save(s);
                logger.debug("新增后ID为：" + s.getId());
            } else {
                Long id = dao.save(s);
                logger.debug("更新成功,影响记录数为：" + id);
            }
            sqlSession.commit(true);
        } catch (Exception e) {
            throw new RuntimeException("保存出错！", e);
        } finally {
            if (sqlSession != null) sqlSession.close();
        }
        return s;
    }

//
//
//    public boolean exists(Serializable serializable) {
//        return false;
//    }


    /**
     * 指定需要做为条伯的字段，若未设置，则表示不按任何条件进行查询
     *
     * @param
     * @return 返回附合查询条件的第一条记录
     */
//    public <E extends T> E findOne(E entity, String... fields) {
//        SqlSession sqlSession = sqlSessionFactory.openSession();
//        Map map = null;
//        E result = null;
//        try {
//            EntityParam param = new EntityParam(entity).put(fields);
//            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
//            map = dao.findOneByEntity(param);
//            sqlSession.commit(true);
//            result = (E) entity.getClass().newInstance();
//            BeanUtils.populate(result, map);
//        } catch (Exception ex) {
//            throw new RuntimeException("查询出错！", ex);
//        } finally {
//            if (sqlSession != null) sqlSession.close();
//        }
//        return result;
//    }
    public T findOne(Class<T> t, Long id) {
        return findOne(t, Param.map("id", id));
    }

    /**
     * 依据单个条件查询
     *
     * @param entityType 实体类型
     * @param fieldName  实体的属性名
     * @param value      实体属性的值
     * @return
     */
    public T findOne(Class<T> entityType, String fieldName, Object value) {
        return findOne(entityType, Param.map(fieldName, value));
    }

    public T findOne(Class<T> entityType, Map.Entry<String, Object>... params) {
        return bind(entityType, findOne(new Param(entityType).put(params)));
    }

    protected Map findOne(Param<T> param) {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        Map map = null;
        try {
            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
            map = dao.findOneByType(param);
            sqlSession.commit(true);
        } catch (Exception e) {
            throw new RuntimeException("查询出错！", e);
        } finally {
            if (sqlSession != null) sqlSession.close();
        }
        return map;
    }

    public List<Map> find(Class<T> entityType, String fieldName, Object value) {
        return find(entityType, Param.map(fieldName, value));
    }

    public List<Map> find(Class<T> entityType, Map.Entry<String, Object>... params) {
        return find(new Param(entityType).put(params));
    }

    public List<Map> find(Param param) {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        List<Map> list = null;
        try {
            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
            list = dao.findByType(param);
            sqlSession.commit(true);
        } catch (Exception e) {
            throw new RuntimeException("查询出错！", e);
        } finally {
            if (sqlSession != null) sqlSession.close();
        }
        return list;
    }

    public List<Map> find(Class clazz) {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        List<Map> list = null;
        try {
            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
            list = dao.find(clazz);
            sqlSession.commit(true);
        } catch (Exception e) {
            throw new RuntimeException("实体" + clazz + "查询出错！", e);
        } finally {
            if (sqlSession != null) sqlSession.close();
        }
        return list;
    }

    /**
     * 通过ID删除
     *
     * @param entityType
     * @param pk
     */
    public void delete(Class entityType, Long pk) {
        delete(entityType, "id", pk);
    }


    public void delete(Class entityType, String fieldName, Object value) {
        delete(new Param(entityType).put(fieldName, value));
    }

    /**
     * 可用于级联删除，从第一个参数开始删除,故第一个参数对应子级需删除的对象
     *
     * @param deleteParams 需删除的对象及参数
     */
    public void delete(Param... deleteParams) {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        if (sqlSession == null) throw new RuntimeException("sqlSession为null，删除失败！");
        try {
            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
            for (Param deleteParam : deleteParams) {
                dao.deleteByType(deleteParam);
                logger.debug("删除：" + deleteParam.getEntityType().getName());
            }
            sqlSession.commit(true);
        } catch (Exception e) {
            sqlSession.rollback();
            throw new RuntimeException("删除出错！", e);
        } finally {
            sqlSession.close();
        }
    }

    /**
     * 删除对应表所有数据，慎用！！
     *
     * @param clazz
     */
    public void delete(Class clazz) {
        delete(new Param(clazz).put("1", "1"));
    }


    /**
     * 基于主键ID批量删除
     * @param entityType
     * @param pksString id连接字符串如：1,2,3,4,5,23,46,234
     * @param splitFlag id连接字符串的连接符,默认为","
     */
    public void delete(Class<T> entityType, String pksString,String splitFlag) {
        Assert.notNull(pksString);
        if(splitFlag==null||"".equals(splitFlag.trim()))splitFlag=",";
        splitFlag = splitFlag.trim();
        delete(entityType,pksString.split(splitFlag));
    }
    /**
     * 基于主键ID批量删除
     * @param pks
     */
    public void delete(Class<T> entityType, String[] pks) {
        if (pks == null) return;
        if (pks.length == 1) {
            delete(entityType, Long.parseLong(pks[0]));
            return;
        }
        List<Long> list = new ArrayList(pks.length);
        for (String pk : pks) {
            list.add(Long.parseLong(pk));
        }
        ;
        List<T> listEntity = new ArrayList(pks.length);
        for (Long pk : list) {
            T obj = null;
            try {
                obj = entityType.newInstance();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            obj.setId(pk);
            listEntity.add(obj);
        }
        delete(listEntity);
    }

    /**
     * 基于主键ID批量删除
     * @param list
     */
    public void delete(List<T> list) {
        Iterator<T> iterator = list.iterator();
        SqlSession sqlSession = sqlSessionFactory.openSession();
        try {
            SimpleCurdDao dao = sqlSession.getMapper(SimpleCurdDao.class);
            while (iterator.hasNext()) {
                T entity = iterator.next();
                if (entity.getId() == null) {
                    logger.debug("entity.getId() is null，no need to delete，the entity is {}", entity);
                } else {
                    dao.delete(entity);
                    logger.debug("delete success,entity is {},id is：" + entity.getId(), entity);
                }
            }
            sqlSession.commit(true);
        } catch (Exception e) {
            if (sqlSession != null)
                sqlSession.rollback();
            throw new RuntimeException("error when batch delete!", e);
        } finally {
            if (sqlSession != null) sqlSession.close();
        }
    }


    private T bind(Class<T> entityType, Map map) {
        if (map == null) return null;
        T obj = null;
        try {
            obj = entityType.newInstance();
            bind(obj, map);
        } catch (Exception e) {
            logger.error("已查询出结果，结果类型从map转为bean时出错！{}", e);
        }
        return obj;
    }

    /**
     * 将map有的值bind到bean中，若map无bean有的属性，则不变动，以原bean的为准。
     *
     * @param bean
     * @param map
     */
    private Object bind(Object bean, Map map) {
        if (map == null || bean == null) return null;
        MetaData metaData = metaDataManager.get(bean.getClass());
        Iterator<String> iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            String columnName = iterator.next();
            ColumnFieldMapping cfm = metaData.getColumnFieldMappingByColumn(columnName);
            if (cfm != null) {
                try {
                    BeanUtils.setProperty(bean, cfm.getFieldName(), map.get(cfm.getColumnName()));
                } catch (Exception e) {
                    logger.debug("复制map中的" + cfm.getColumnName() + "{}到bean属性" + cfm.getFieldName() + "出错！{}", map.get(cfm.getColumnName()), e);
                }
            }
        }
        return bean;
    }


}
