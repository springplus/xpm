package org.xpm.entity;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
@Table(name = "md_logic_field")
public class LogicField extends BaseEntity {

    private LogicEntity logicEntity;
    private String name;
    private String code;
    private String description;

    public LogicField() {
    }

    public LogicField(Long id) {
        this.setId(id);
    }

    @ManyToOne
    @JoinColumn(name = "md_logic_entity_id")
    public LogicEntity getLogicEntity() {
        return logicEntity;
    }

    public void setLogicEntity(LogicEntity logicEntity) {
        this.logicEntity = logicEntity;
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
