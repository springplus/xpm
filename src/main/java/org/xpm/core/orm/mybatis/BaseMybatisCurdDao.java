package org.xpm.core.orm.mybatis;

import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.SelectProvider;
import org.xpm.core.orm.mybatis.sqlProvider.*;
import org.xpm.core.orm.entity.IdEntity;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-23.
 */
public interface BaseMybatisCurdDao<T extends IdEntity, ID extends java.io.Serializable>{


    @InsertProvider(type= SaveSqlProvider.class,method="save")
    @Options(useGeneratedKeys = true)
    /**
     * 返回的实体ID被自动填充到实体中 @Options(useGeneratedKeys = true)
     * 本方法直接是保存影响的记录数
     * @ 这种方式也可以取回实体ID:@SelectKey(before=false,keyProperty="id",resultType=Long.class,statementType= StatementType.STATEMENT,statement="SELECT LAST_INSERT_ID() AS id")
     */
    public <S extends T> Long save(S s);

//    @InsertProvider(type= SaveSqlProvider.class,method="updateByType")
//    public Long update(Param param);

    @InsertProvider(type=SaveSqlProvider.class,method="saveBatch")
    public <S extends T> Long saveBatch(Iterator<S> iterator);


    @SelectProvider(type=QuerySqlProvider.class,method = "findOneByType")
    public Map findOneByType(Param param);

//    @SelectProvider(type=QuerySqlProvider.class,method = "findOneByEntity")
//    public Map findOneByEntity(EntityParam entityParam);

    @SelectProvider(type= QuerySqlProvider.class,method = "findByType")
    public List<Map> findByType(Param queryParam);

    @SelectProvider(type= QuerySqlProvider.class,method = "find")
    public List<Map> find(Class clazz);


    @DeleteProvider(type=DeleteSqlProvider.class,method="deleteByType")
    public void deleteByType(Param deleteParam);

    /**
     * 通过id删除
     * @param t
     */
    @DeleteProvider(type=DeleteSqlProvider.class,method="delete")
    public void delete(T t);

//    void deleteByEntitys(java.lang.Iterable<? extends T> iterable);

    @DeleteProvider(type=DeleteSqlProvider.class,method="deleteAll")
    public void deleteAll(Class clazz);

    //    boolean exists(ID id);

}