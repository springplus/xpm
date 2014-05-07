package org.xpm.core.orm.mybatis;

import java.util.Collection;
import java.util.HashMap;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class MetaData {

    private ColumnFieldMapping id;
    private TableEntityMapping tableEntityMapping;
    private Collection<ColumnFieldMapping> columnNames;

    public  MetaData() {

    }
    public MetaData parse(Class clazz){
        parseId(clazz);
        parseTable(clazz);
        parseFields(clazz);
        return this;
    }

    /**
     * 基于@Id获取实体中的主键字段名
     *
     * @return
     */
    public ColumnFieldMapping getId() {
        return id;
    }

    public String getTableName() {
        return tableEntityMapping.getTableName();
    }

    /**
     * @return List of Entry<columnName,fieldName></>
     */
    public Collection<ColumnFieldMapping> getColumnNames() {
        return this.columnNames;
    }

    public ColumnFieldMapping getColumnFieldMapping(String fieldName){
        if(this.columnNames==null||this.columnNames.size()==0)return null;
        for(ColumnFieldMapping cfm:columnNames){
            if(cfm.getFieldName().equals(fieldName))return cfm;
        }
        return null;
    }

    public ColumnFieldMapping getColumnFieldMappingByColumn(String columnName){
        if(this.columnNames==null||this.columnNames.size()==0)return null;
        for(ColumnFieldMapping cfm:columnNames){
            if(cfm.getColumnName().equals(columnName))return cfm;
        }
        return null;
    }

//    public ColumnFieldMapping findByField(String fieldName){
//        if(this.columnNames==null)return null;
//        Iterator<ColumnFieldMapping> cfms = columnNames.iterator();
//        if(cfms.hasNext()){
//            ColumnFieldMapping cfm = cfms.next();
//            if(cfm.getFieldName()==fieldName)return cfm;
//        }
//        return null;
//    }

    private void parseId(Class clazz) {
//        for (Field field : s.getClass().getDeclaredFields()) {
//            if (field.isAnnotationPresent(Id.class))
//                id = field.getName();
//        }
//        throw new RuntimeException("No @Id founded!");
        id = Relf.getId(clazz);
    }

    private void parseFields(Class clazz) {
//        HashMap<String,Field> fieldMap = Relf.getAccessibleFields(s);
//        columnNames = new ArrayList<ColumnFieldMapping>();
//        Iterator<Map.Entry<String,Field>> it = fieldMap.entrySet().iterator();
//        while (it.hasNext()){
//            Map.Entry<String,Field> entry = it.next();
//            Field field = entry.getValue();
//            Column column = field.getAnnotation(Column.class);
//            if(column!=null&&column.name()!=null){
//                columnNames.add(new ColumnFieldMapping(column.name(),field.getName()));
//            }else{
//                columnNames.add(new ColumnFieldMapping(field.getName(),field.getName()));
//            }
//        }
        HashMap<String, ColumnFieldMapping> map = Relf.getColumnFieldMappings(clazz);
        columnNames = map.values();
    }

    private  void parseTable(Class clazz) {
        this.tableEntityMapping = Relf.getTable(clazz);
//        Table table = s.getClass().getAnnotation(Table.class);
//        if (table != null)
//            tableName = table.name() != null ? table.name() : s.getClass().getName();
//        else
//            throw new RuntimeException("No @Table founded!");
    }


}
