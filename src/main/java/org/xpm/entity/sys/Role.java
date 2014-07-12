package org.xpm.entity.sys;

import org.xpm.core.orm.entity.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-4-12.
 */
@Entity
@Table(name = "sys_role")
public class Role extends BaseEntity{
    private String name;
    private String code;
    private String description;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
