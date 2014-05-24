package org.xpm.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.IdEntity;
import org.xpm.entity.sys.Permission;

/**
 * Created by hongxq on 2014/5/23.
 */
@Component
public class BaseRestController<T extends IdEntity> {
//    @Autowired
//    protected T entity;
//    @Autowired
//    protected BaseDao<T> baseDao;
//
//
//    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void delete(@PathVariable("id") Long id) {
//        baseDao.delete(entity.getClass(), id);
//    }
}
