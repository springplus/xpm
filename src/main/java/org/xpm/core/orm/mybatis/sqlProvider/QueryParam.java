package org.xpm.core.orm.mybatis.sqlProvider;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by hongxq on 2014/6/28.
 */
public class QueryParam extends HashMap<String, String>{
    private String sqlKey;
    private String queryFields;
    private String sqlParsed;

    public String getSqlKey() {
        return sqlKey;
    }

    /**
     * mybatis中配置语句的id
     * 命名规则建议：{action}.{moduleName}.{fnName}，如query.sys.userRoleMap
     */
    public void setSqlKey(String sqlKey) {
        this.sqlKey = sqlKey;
    }

    /**
     * 查询的字段，格式为fieldName,fieldName,...
     * @return
     */
    public String getQueryFields() {
        return queryFields;
    }

    public String setQueryFields(String queryFields) {
        if(queryFields==null)return "";
        String trimFields = queryFields.trim();
        String[] fields = trimFields.trim().split(",");
        if(fields.length==0) return "";
        for(String field:fields){
            if(!validateQuery(field)){
                return String.format("查询字段：{field}，格式不符合要求！",field);
            }
        }

        this.queryFields = trimFields;
        return "";
    }

    private boolean validateQuery(String field){


        return true;
    }

    public String getSqlParsed() {
        return sqlParsed;
    }

    public void setSqlParsed(String sqlParsed) {
        this.sqlParsed = sqlParsed;
    }
}
