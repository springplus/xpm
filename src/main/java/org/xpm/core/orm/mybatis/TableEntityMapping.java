package org.xpm.core.orm.mybatis;

/**
 * Created by hongxueqian on 14-3-24.
 */
public class TableEntityMapping {
    private String tableName;
    private String entityName;

    public TableEntityMapping(String tableName, String entityName) {
        this.tableName = tableName;
        this.entityName = entityName;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }
}
