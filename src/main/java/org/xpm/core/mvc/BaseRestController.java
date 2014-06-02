package org.xpm.core.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springside.modules.web.MediaTypes;
import org.xpm.core.mvc.MapWrapper;
import org.xpm.core.orm.mybatis.BaseDao;
import org.xpm.entity.BaseEntity;
import org.xpm.rest.RestException;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


/**
 * Created by hongxq on 2014/5/23.
 */
public abstract class BaseRestController<T extends BaseEntity> {

    @Autowired
    protected BaseDao<T> baseDao;

    protected abstract Class<T> getEntityType();


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public T findOne(@PathVariable("id") Long id) {
        return baseDao.findOne(getEntityType(), id);
    }

    @RequestMapping(value = {"", "/*"}, method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public T save(@RequestBody T entity) {
        return baseDao.save(entity);
    }


    /**
     * @param ids
     * @param map
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") String ids, @RequestParam Map map) {
        MapWrapper mw = MapWrapper.wrap(map);
        baseDao.delete(getEntityType(), ids, mw.getString("flag"));
    }


    /**
     * 若子类中不支持delete方法，可override,写法如下
     * public void delete(@PathVariable("id") String ids, @RequestParam Map map) {
     *    throwNotAllowedException();
     * }
     */
    protected void throwNotAllowedException() {
        throw new RestException(HttpStatus.METHOD_NOT_ALLOWED, "不支持该方法");
    }
}
