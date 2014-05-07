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
}
