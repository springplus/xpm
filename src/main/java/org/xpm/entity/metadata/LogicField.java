package org.xpm.entity.metadata;

import org.xpm.entity.BaseEntity;

import javax.persistence.*;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
@Table(name = "md_logic_field")
public class LogicField extends BaseEntity {

//    private LogicEntity logicEntity;
    private String name;
    private String code;
    private String description;
    private Long logicEntityId;


    public LogicField() {
    }

    public LogicField(Long id) {
        this.setId(id);
    }

//    @ManyToOne
//    @JoinColumn(name = "md_logic_entity_id")
//    public LogicEntity getLogicEntity() {
//        return logicEntity;
//    }
//
//    public void setLogicEntity(LogicEntity logicEntity) {
//        this.logicEntity = logicEntity;
//    }


    @Column(name="md_logic_entity_id")
    public Long getLogicEntityId() {
        return logicEntityId;
    }

    public void setLogicEntityId(Long logicEntityId) {
        this.logicEntityId = logicEntityId;
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
