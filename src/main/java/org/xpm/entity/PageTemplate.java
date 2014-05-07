package org.xpm.entity;

import javax.persistence.*;
import javax.persistence.Entity;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Entity
@Table(name = "page_template")
public class PageTemplate extends BaseEntity {

    private String filePath;
    private String code;
    private String webUrl;

    private String description;

    @Basic
    @Column(name = "file_path")
    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getWebUrl() {
        return webUrl;
    }

    public void setWebUrl(String webUrl) {
        this.webUrl = webUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
