package org.xpm.core.orm.entity;

import org.xpm.core.orm.entity.IdEntity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.util.Date;

/**
 * Created by hongxueqian on 14-3-16.
 */
@MappedSuperclass
public class BaseEntity extends IdEntity {
    private Date createDate;
    private Date updateDate;
    private Long creator;
    private Long updater;

    public BaseEntity() {
    }
    public BaseEntity(Long Id) {
        setId(id);
    }

    @Column(name = "create_date")
    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Column(name = "update_date")
    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public Long getCreator() {
        return creator;
    }

    public void setCreator(Long creator) {
        this.creator = creator;
    }

    public Long getUpdater() {
        return updater;
    }

    public void setUpdater(Long updater) {
        this.updater = updater;
    }
}
