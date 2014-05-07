package org.xpm.core.orm.mybatis;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.*;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class Relf {

    private static Logger logger = LoggerFactory.getLogger(Relf.class);

    /**
     * 循环向上转型, 获取对象的DeclaredFields
     * <p/>
     * 如向上转型到Object仍无法找到, 返回null.
     */
    public static HashMap<String, Field> getAccessibleFields(final Object obj) {
        Validate.notNull(obj, "object can't be null");
        HashMap<String, Field> fieldMap = new HashMap<String, Field>();
        for (Class<?> superClass = obj.getClass(); superClass != Object.class; superClass = superClass.getSuperclass()) {
            Field[] fields = superClass.getDeclaredFields();
            for (Field field : fields) {
                if (!fieldMap.containsKey(field.getName()))
                    fieldMap.put(field.getName(), field);
            }
        }
        return fieldMap;
    }

    public static TableEntityMapping getTable(final Object obj) {
        return getTable(obj.getClass());
    }

    public static TableEntityMapping getTable(Class clazz) {
        Entity entity = (Entity) clazz.getAnnotation(Entity.class);
        if (entity == null)
            throw new RuntimeException("No @Entity founded when parse class:" + clazz.getName());
        Table table = (Table) clazz.getAnnotation(Table.class);
        if (table != null && table.name() != null && !table.name().trim().equals("")) {
            return new TableEntityMapping(table.name(), clazz.getSimpleName());
        } else {
            return new TableEntityMapping(clazz.getSimpleName(), clazz.getSimpleName());
        }
    }

    public static ColumnFieldMapping getId(final Object obj) {
        Validate.notNull(obj, "object can't be null");
        return getId(obj.getClass());
    }

    public static ColumnFieldMapping getId(Class clazz) {
        for (Class<?> searchType = clazz; searchType != Object.class; searchType = searchType.getSuperclass()) {
            Method[] methods = searchType.getDeclaredMethods();
            for (Method method : methods) {
                Id id = method.getAnnotation(Id.class);
                if (id != null) {
                    String fieldName = method.getName().substring(3);
                    String firstChar = "" + fieldName.charAt(0);
                    fieldName = fieldName.replaceFirst(firstChar, firstChar.toLowerCase());
                    return new ColumnFieldMapping(fieldName, fieldName);
                }
            }
        }
        throw new RuntimeException("No @Id founded!");
    }

    public static HashMap<String, ColumnFieldMapping> getColumnFieldMappings(final Object obj) {
        Validate.notNull(obj, "object can't be null");
        return getColumnFieldMappings(obj.getClass());
    }

    public static HashMap<String, ColumnFieldMapping> getColumnFieldMappings(Class clazz) {
        HashMap<String, ColumnFieldMapping> map = new HashMap<String, ColumnFieldMapping>();
        for (Class<?> searchType = clazz; searchType != Object.class; searchType = searchType.getSuperclass()) {
            Method[] methods = searchType.getDeclaredMethods();
            for (Method method : methods) {
                //去掉get三个字符
                String fieldName = "";
                if (method.getName().startsWith("set")) continue;
                if (method.getName().startsWith("get"))
                    fieldName = method.getName().substring(3);
                if (method.getName().startsWith("is"))
                    fieldName = method.getName().substring(2);
                //首字符变小写
                String firstChar = "" + fieldName.charAt(0);
                fieldName = fieldName.replaceFirst(firstChar, firstChar.toLowerCase());
                if (!map.containsKey(fieldName)) {
                    //如果列中有@Transient，则跳过
                    if (method.getAnnotation(Transient.class) == null) {
                        //列，可能包括名为id的列
                        Column column = method.getAnnotation(Column.class);
                        if (column != null && column.name() != null) {
                            map.put(fieldName, new ColumnFieldMapping(column.name(), fieldName));
                        } else {
                            map.put(fieldName, new ColumnFieldMapping(fieldName, fieldName));

                        }
                    }
                }
            }
        }
        return map;
    }



}
