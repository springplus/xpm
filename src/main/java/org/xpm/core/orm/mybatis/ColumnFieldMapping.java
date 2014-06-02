package org.xpm.core.orm.mybatis;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class ColumnFieldMapping {
    private String columnName;
    private String fieldName;

    public ColumnFieldMapping(String columnName, String fieldName) {
        this.columnName = columnName;
        this.fieldName = fieldName;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    /**
     * 如果columnName或fieldName为空，则返回false
     * @return
     */
    public boolean isEquals(){
        if(columnName==null||fieldName==null)
            return false;
        return columnName.equals(fieldName);
    }
}
