package org.xpm.entity.common;

import org.xpm.entity.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxueqian on 14-4-17.
 */
@Entity
@Table(name = "f_file")
public class File extends BaseEntity{
    private String uuid;
    private String description;
    private String contentType;
    private String originalName;
    private long size;
    private String localPath;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String guid) {
        this.uuid = guid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name = "content_type")
    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    @Column(name = "original_name")
    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    @Column(name = "local_path")
    public String getLocalPath() {
        return localPath;
    }

    public void setLocalPath(String localPath) {
        this.localPath = localPath;
    }
}
