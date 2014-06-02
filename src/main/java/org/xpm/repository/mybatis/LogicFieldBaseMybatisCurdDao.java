package org.xpm.repository.mybatis;

import org.xpm.core.orm.mybatis.MyBatisRepository;
import org.xpm.entity.metadata.LogicEntity;

/**
 * Created by hongxueqian on 14-3-21.
 */
@MyBatisRepository
public interface LogicFieldBaseMybatisCurdDao {

     public int importFields(LogicEntity logicEntity);


}
