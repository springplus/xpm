package org.xpm.entity.sys;

import org.xpm.core.orm.entity.IdEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by hongxq on 2014/6/19.
 */
@Entity
@Table(name = "sys_role_r_user")
public class RoleUserMap extends IdEntity{
    private Long roleId;

    private Long userId;

    @Column(name = "sys_role_id")
    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    @Column(name = "sys_user_id")
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
