package org.xpm.core.orm.mybatis.sqlProvider;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class SimpleInsertSqlBuilder {
    private StringBuilder sb = new StringBuilder();
    private HashMap<String, String> values = new HashMap<String, String>();

    public void INSERT_INTO(String tableName) {
        sb.append("insert into ");
        sb.append(tableName);
        sb.append(" ");
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

    public String toSql() {
        Iterator<Map.Entry<String, String>> it = values.entrySet().iterator();
        StringBuilder vsb = new StringBuilder();
        sb.append("(");
        vsb.append(" values(");
        int index = 0;
        while (it.hasNext()) {
            index += 1;
            Map.Entry entry = it.next();
            sb.append(entry.getKey());
            vsb.append(entry.getValue());
            if (index < values.size()) {
                sb.append(",");
                vsb.append(",");
            }
        }
        sb.append(")");
        vsb.append(")");
        return sb.append(vsb).toString();
    }

}
