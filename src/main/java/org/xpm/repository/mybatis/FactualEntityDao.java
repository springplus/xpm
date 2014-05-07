package org.xpm.repository.mybatis;

import org.xpm.core.orm.mybatis.MyBatisRepository;

import java.util.List;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-23.
 */
@MyBatisRepository
public interface FactualEntityDao {

    public List<Map> query();
}
