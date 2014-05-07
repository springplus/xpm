package org.xpm.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-4-1.
 */
@Entity
@Table(name="md_data_item_catalog")
public class DataItemCatalog extends BaseEntity{
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
