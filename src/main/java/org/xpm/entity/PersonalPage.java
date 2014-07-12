package org.xpm.entity;

import org.xpm.core.orm.entity.BaseEntity;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import javax.persistence.Entity;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
public class PersonalPage extends BaseEntity {

    private String config;
    private Page page;
    private Long creator;

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    @ManyToOne
    @JoinColumn(name="page_id")
    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }


}
