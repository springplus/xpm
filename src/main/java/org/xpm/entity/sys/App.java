package org.xpm.entity.sys;

import org.xpm.core.orm.entity.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-5-2.
 */
@Entity
@Table(name = "sys_app")
public class App extends BaseEntity{
    private String name;
    private String code;
    private String href;
    private String icon;
    private String description;

    public App() {
    }

    public App(Long id) {
        this.setId(id);
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

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
