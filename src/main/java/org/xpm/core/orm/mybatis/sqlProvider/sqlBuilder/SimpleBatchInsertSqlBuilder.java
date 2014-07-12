package org.xpm.core.orm.mybatis.sqlProvider.sqlBuilder;

import java.util.*;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class SimpleBatchInsertSqlBuilder {
    private StringBuilder sb = new StringBuilder();
    private List<EntityValues> list = new ArrayList<EntityValues>();

    public void INSERT_INTO(String tableName) {
        sb.append("insert into ");
        sb.append(tableName);
        sb.append(" ");
    }

    public EntityValues startOne(){
        EntityValues ev = new EntityValues();
        list.add(ev);
        return ev;
    }

    public String toSql() {
        //构造列名
        if(list.size()>0){
            HashMap<String, String> values = list.get(0).values;
            Iterator<Map.Entry<String, String>> it = values.entrySet().iterator();
            sb.append("(");
            int index = 0;
            while (it.hasNext()) {
                index += 1;
                Map.Entry entry = it.next();
                sb.append(entry.getKey());
                if (index < values.size()) {
                    sb.append(",");
                }
            }
            sb.append(")");
        }
        int entityIndex=0;
        StringBuilder vsb = new StringBuilder();
        vsb.append(" values ");
        for(EntityValues entityValues:list){
            HashMap<String, String> values = entityValues.values;
            Iterator<Map.Entry<String, String>> it = values.entrySet().iterator();
            vsb.append("(");
            int index = 0;
            while (it.hasNext()) {
                index += 1;
                Map.Entry entry = it.next();
                vsb.append(entry.getValue());
                if (index < values.size()) {
                    vsb.append(",");
                }
            }
            vsb.append(")");
            entityIndex+=1;
            if (entityIndex < list.size()) {
                vsb.append(",");
            }
        }

        return sb.append(vsb).toString();
    }


    class EntityValues{
        HashMap<String, String> values = new HashMap<String, String>();

        /**
         * id = #{id}
         * id = ${id}
         *
         * @param name
         * @param value
         * @Param wrapSign # or $
         */
        void VALUES(String name, String value, String wrapSign) {
            if (wrapSign == null || wrapSign.trim() == "")
                values.put(name, value);
            else
                values.put(name, wrapSign + "{" + value + "}");
        }

        void VALUES(String name, String value) {
            VALUES(name,value,null);
        }
    }

}
