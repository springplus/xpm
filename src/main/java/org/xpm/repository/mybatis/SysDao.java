package org.xpm.repository.mybatis;

import org.xpm.core.orm.mybatis.MyBatisRepository;

import java.util.List;

/**
 * Created by hongxueqian on 14-4-12.
 * 按模块命名，一般来说一个模块中需要再编写语句的场景较少
 */
@MyBatisRepository
public interface SysDao {

    public List<String> findPermissionsByLoginName(String loginName);

    public List<String> findRolesByLoginName(Long id);

    /**
     * 删除用户及用户的角色信息
     * @param id
     */
    public void deleteUserById(Long id);

}
