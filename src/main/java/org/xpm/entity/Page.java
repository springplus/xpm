package org.xpm.entity;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
public class Page extends IdEntity{
    private String config ;
    private PageTemplate pageTemplate;

    @ManyToOne
    @JoinColumn(name="page_template_id")
    public PageTemplate getPageTemplate() {
        return pageTemplate;
    }

    public void setPageTemplate(PageTemplate pageTemplate) {
        this.pageTemplate = pageTemplate;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }
}