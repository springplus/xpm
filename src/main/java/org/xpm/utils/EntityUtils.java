package org.xpm.utils;

import org.xpm.entity.BaseEntity;

import java.util.Date;
import java.util.List;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class EntityUtils {

    public static BaseEntity fillBeforeSave(BaseEntity baseEntity){
        Long currentUserId = 1L;
        if(baseEntity.getCreator()==null){
            baseEntity.setCreator(currentUserId);
            baseEntity.setCreateDate(new Date());
        }
        baseEntity.setUpdater(currentUserId);
        baseEntity.setUpdateDate(new Date());
        if(baseEntity.getId()!=null&&baseEntity.getId()<=0)baseEntity.setId(null);
        return baseEntity;
    }

    public static <S extends BaseEntity> List<S> fillBeforeSave(List<S> entities){
        for(BaseEntity baseEntity:entities){
            fillBeforeSave(baseEntity);
        }
        return entities;
    }
}
