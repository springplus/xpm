package org.xpm.entity.sys;

import org.xpm.core.orm.entity.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-4-12.
 */
@Entity
@Table(name = "sys_permission")
public class Permission extends BaseEntity{

    private String name;

    private String text;

    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
