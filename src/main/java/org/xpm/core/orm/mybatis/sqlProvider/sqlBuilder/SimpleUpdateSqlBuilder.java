package org.xpm.core.orm.mybatis.sqlProvider.sqlBuilder;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class SimpleUpdateSqlBuilder {
    private StringBuilder sb = new StringBuilder();
    private HashMap<String, String> values = new HashMap<String, String>();
    private HashMap<String, String> conditions = new HashMap<String, String>();

    public void UPDATE(String tableName) {
        sb.append("update ");
        sb.append(tableName);
        sb.append(" set ");
    }

    /**
     * id = #{id}
     * id = ${id}
     *
     * @param name
     * @param value
     * @Param wrapSign # or $
     */
    public void VALUES(String name, String value, String wrapSign) {
        if (wrapSign == null || wrapSign.trim() == "")
            values.put(name, value);
        else
            values.put(name, wrapSign + "{" + value + "}");
    }

    public void VALUES(String name, String value) {
        VALUES(name,value,null);
    }

    public void CONDITIONS(String name, String value, String wrapSign) {
        if (wrapSign == null || wrapSign.trim() == "")
            conditions.put(name, value);
        else
            conditions.put(name, wrapSign + "{" + value + "}");
    }


    public String toSql() {
        Iterator<Map.Entry<String, String>> it = values.entrySet().iterator();
        StringBuilder vsb = new StringBuilder();
        int index = 0;
        while (it.hasNext()) {
            index += 1;
            Map.Entry entry = it.next();
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(entry.getValue());
            if (index < values.size()) {
                sb.append(",");
            }
        }

        Iterator<Map.Entry<String, String>> csIt = conditions.entrySet().iterator();
        int csIndex = 0;
        while(csIt.hasNext()){
            if (csIndex ==0) {
                sb.append(" where ");
            }
            csIndex +=1;
            Map.Entry entry = csIt.next();
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(entry.getValue());
            if (csIndex < conditions.size()) {
                sb.append(" and ");
            }
        }
        return sb.toString();
    }

}
