package org.xpm.entity.metadata;

import org.xpm.entity.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
@Table(name="md_data_item")
public class DataItem extends BaseEntity {
    private String name;
    private String code;
    private String type;
    private String valueExpression;
    private boolean inbuilt;
    private String description;
    private Long dataItemCatalogId;

    public DataItem() {
    }

    public DataItem(Long id) {
        setId(id);
    }

    @Column(name="md_data_item_catalog_id")
    public Long getDataItemCatalogId() {
        return dataItemCatalogId;
    }

    public void setDataItemCatalogId(Long dataItemCatalogId) {
        this.dataItemCatalogId = dataItemCatalogId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Column(name="value_expression")
    public String getValueExpression() {
        return valueExpression;
    }

    public void setValueExpression(String valueExpression) {
        this.valueExpression = valueExpression;
    }

    public boolean getInbuilt() {
        return inbuilt;
    }

    public void setInbuilt(boolean inbuilt) {
        this.inbuilt = inbuilt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
