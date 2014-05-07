package org.xpm.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by hongxueqian on 14-3-22.
 */
@Component
public class UtilsDao {
//    protected static PropertiesLoader propertiesLoader = new PropertiesLoader("classpath:/application.properties",
//            "classpath:/application.functional.properties", "classpath:/application.functional-local.properties");

    @Autowired
    private  JdbcTemplate jdbcTemplate;

    public  List queryForList(String sqlKey){
        return jdbcTemplate.queryForList("select table_name code,TABLE_COMMENT name from v_entity_unmanaged");
    }
}
