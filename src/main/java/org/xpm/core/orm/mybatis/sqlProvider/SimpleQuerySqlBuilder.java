package org.xpm.core.orm.mybatis.sqlProvider;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class SimpleQuerySqlBuilder {
    private StringBuilder sb = new StringBuilder();
    private HashMap<String, String> values = new HashMap<String, String>();
    private HashMap<String, String> conditions = new HashMap<String, String>();
    private String tableName;
    private boolean isLimitOne = false;
    private String renamedSelectFields;

    public void SELECT(String tableName, String renamedSelectFields) {
        this.tableName = tableName;
        isLimitOne = false;
        this.renamedSelectFields = renamedSelectFields;
    }

    public void SELECT_ONE(String tableName) {
        this.tableName = tableName;
        isLimitOne = true;
    }

//    public void FIELDS(String[] names) {
//        if (wrapSign == null || wrapSign.trim() == "")
//            conditions.put(name, value);
//        else
//            conditions.put(name, wrapSign + "{" + value + "}");
//    }

    /**
     * @param columnName 数据库中对应表的列名
     * @param fieldName  参数中的实体的属性名或Map中的Key
     * @param wrapSign
     */
    public void CONDITIONS(String columnName, String fieldName, String wrapSign) {
        if (wrapSign == null || wrapSign.trim() == "")
            conditions.put(columnName, fieldName);
        else
            conditions.put(columnName, wrapSign + "{" + fieldName + "}");
    }


    public String toSql() {
        sb.append("select ");
        if (this.renamedSelectFields != null && this.renamedSelectFields.length() > 0)
            sb.append(this.renamedSelectFields);
        else
            sb.append("*");
        sb.append(" from ");
        sb.append(tableName);
        sb.append(" where 1=1 ");


        Iterator<Map.Entry<String, String>> csIt = conditions.entrySet().iterator();
        int csIndex = 0;
        while (csIt.hasNext()) {
            csIndex += 1;
            sb.append(" and ");
            Map.Entry entry = csIt.next();
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(entry.getValue());

        }
        if (isLimitOne) sb.append(" limit  1 ");
        return sb.toString();
    }

}
