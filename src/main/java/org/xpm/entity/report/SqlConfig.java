package org.xpm.entity.report;

import org.xpm.core.orm.entity.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxq on 2014/6/28.
 */
@Entity
@Table(name="rpt_sql_config")
public class SqlConfig extends BaseEntity {

    private String sqlKey;
    private String content;
    private Long appId;
    private String name;
    private String parameters;

    @Column(name = "sql_key")
    public String getSqlKey() {
        return sqlKey;
    }

    public void setSqlKey(String key) {
        this.sqlKey = key;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Column(name = "sys_app_id")
    public Long getAppId() {
        return appId;
    }

    public void setAppId(Long appId) {
        this.appId = appId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }
}
