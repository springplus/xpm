package org.xpm.core.orm.mybatis;

import org.apache.ibatis.annotations.SelectProvider;
import org.xpm.core.orm.mybatis.MyBatisRepository;
import org.xpm.core.orm.mybatis.sqlProvider.KeySqlProvider;
import org.xpm.core.orm.mybatis.sqlProvider.QueryParam;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxq on 2014/6/28.
 */
@MyBatisRepository
public interface MybatisQueryDao {

    @SelectProvider(type = KeySqlProvider.class, method = "find")
    public List<Map> find(QueryParam param);


}
