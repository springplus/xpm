package org.xpm.core.orm.mybatis.sqlProvider;

import org.xpm.entity.IdEntity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by hongxueqian on 14-4-13.
 * 基于实体的参数
 */
public class EntityParam<E extends IdEntity>{

    private E entity;
    private List<String> list;

    public EntityParam(E entity) {
        if (entity == null) throw new RuntimeException("实体不能为空！");
        this.entity = entity;
    }

    public E getEntity() {
        return entity;
    }

    public Class getEntityType() {
        return entity.getClass();
    }

    /**
     * 过滤E e中的属性，只保存这些属性；
     * 若未设置则，表示需要所有字段
     * @param fieldNames
     * @return
     */
    public EntityParam put(String... fieldNames) {
        if (fieldNames != null) {
            if (this.list == null)
                this.list = new ArrayList<String>();
            for (String filedName : fieldNames) {
                list.add(filedName);
            }
        }
        return this;
    }

    public boolean isPutParam(){
        if(this.list==null||this.list.size()==0){
            return false;
        }else{
           return true;
        }
    }

    public String[] getParams(){
        if(this.list==null||this.list.size()==0){
            return null;
        }else{
            String[] result = new String[this.list.size()];
            return this.list.toArray(result);
        }
    }
}
