package org.xpm.core.orm.mybatis;

import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Created by hongxueqian on 14-3-23.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Component
public @interface MyBatisRepository {
    String value() default "";
}
