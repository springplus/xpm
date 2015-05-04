package org.xpm.entity.crm;

import org.xpm.core.orm.entity.IdEntity;

import javax.persistence.*;

/**
 * Created by hongxq on 2015/5/3.
 */
@Entity
@Table(name = "crm_supplier")
public class Supplier extends IdEntity{
    private long id;
    private String name;
    private String address;
    private String description;

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Basic
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}
