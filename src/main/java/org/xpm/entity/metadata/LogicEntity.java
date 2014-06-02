package org.xpm.entity.metadata;

import org.xpm.entity.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
@Table(name = "md_logic_entity")
public class LogicEntity extends BaseEntity {

    private String name;
    private String code;

    private String description;

    public LogicEntity() {
    }

    public LogicEntity(Long id) {
        setId(id);
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
