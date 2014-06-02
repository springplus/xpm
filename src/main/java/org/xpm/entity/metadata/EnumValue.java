package org.xpm.entity.metadata;

import org.xpm.entity.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
@Table(name="md_enum_value")
public class EnumValue extends BaseEntity {

    private String value;
    private String code;
    private String dataItemCode;
    public EnumValue() {
    }
    public EnumValue(Long id) {
        setId(id);
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Column(name="data_item_code")
    public String getDataItemCode() {
        return dataItemCode;
    }

    public void setDataItemCode(String dataItemCode) {
        this.dataItemCode = dataItemCode;
    }

    //    @ManyToOne
//    @JoinColumn(name="infact_entity_id")

}
