package org.xpm.core.orm.mybatis.sqlProvider;

import org.xpm.core.orm.entity.IdEntity;

/**
 * Created by hongxq on 2014/6/19.
 */
@java.lang.annotation.Target({java.lang.annotation.ElementType.TYPE})
@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
public @interface Query {

    String leftLink();
}
