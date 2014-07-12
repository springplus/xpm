package org.xpm.core.orm.mybatis.sqlProvider.sqlBuilder;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-30.
 */
public class SimpleDeleteSqlBuilder {
    private StringBuilder sb = new StringBuilder();
    private HashMap<String, String> values = new HashMap<String, String>();

    public void DELETE(String tableName) {
        sb.append("delete from ");
        sb.append(tableName);
        sb.append(" where ");
//        sb.append(" where 1=1"); 避免没传条件时被全部删除，这里不写1=1

    }

    /**
     * id = #{id}
     * id = ${id}
     *
     * @param columnName
     * @param valueExpression 对应替换实体中的字段或Map中的KEY
     * @Param wrapSign # or $
     */
    public void VALUES(String columnName, String valueExpression, String wrapSign) {
        if (wrapSign == null || wrapSign.trim() == "")
            values.put(columnName, valueExpression);
        else
            values.put(columnName, wrapSign + "{" + valueExpression + "}");
    }

    /**
     * 可用于设置固定值，如1=1，name='张三'，用非变量的方式
     * @param name
     * @param value
     */
    public void VALUES(String name, String value) {
        VALUES(name,value,null);
    }

    public String toSql() {
        Iterator<Map.Entry<String, String>> it = values.entrySet().iterator();
        int index = 0;
        while (it.hasNext()) {
            index += 1;
            if(index>1)sb.append(" and ");
            Map.Entry entry = it.next();
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(entry.getValue());
        }
        return sb.toString();
    }
}
