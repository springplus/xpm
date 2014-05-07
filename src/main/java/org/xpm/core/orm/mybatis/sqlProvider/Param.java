package org.xpm.core.orm.mybatis.sqlProvider;

import org.xpm.entity.IdEntity;

import java.util.AbstractMap;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by hongxueqian on 14-4-13.
 * 基于类型的参数
 */
public class Param<T extends IdEntity> {
    protected Class<T> entityType;
    protected HashMap<String,Object> values;

    public Param(Class<T> entityType) {
        this.entityType = entityType;
        values = new HashMap<String, Object>();
    }

    public static Map.Entry<String, Object> map(String filedName, Object value) {
        return new AbstractMap.SimpleEntry<String, Object>(filedName, value);
    }

    public Class<T> getEntityType() {
        return this.entityType;
    }

    /**
     *
     * @param fieldName
     * @param value
     * @return
     */
    public Param put(String fieldName,Object value){
        values.put(fieldName,value);
        return this;
    }

    public Param put(Map.Entry<String,Object>...params){
        if(params!=null){
            for(Map.Entry<String,Object> param:params){
                values.put(param.getKey(),param.getValue());
            }
        }
        return this;
    }

    public HashMap getValues() {
        return values;
    }

    /**
     * 参数中是否存在该字段
     * @param fieldName
     * @return
     */
    public boolean containsField(String fieldName){
        if(values==null)return false;
        return values.containsKey(fieldName);
    }

}
