package org.xpm.core.orm.mybatis;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.xpm.utils.ClassScanner;

import javax.persistence.Entity;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

/**
 * Created by hongxueqian on 14-3-23.
 * TODO 改成单实例
 */
@Component
public class MetaDataManager {

    private static org.slf4j.Logger logger = LoggerFactory.getLogger(MetaDataManager.class);
    private static HashMap<String, MetaData> metaDataMap = new HashMap<String, MetaData>();

    public MetaData get(Class clazz) {

        if (metaDataMap.containsKey(clazz.getName())) {
            return metaDataMap.get(clazz.getName());
        } else {
            Iterator<String> it = metaDataMap.keySet().iterator();
            logger.warn("Key({}) not found in metaDataMap.keySet:", clazz.getName());
            while (it.hasNext()) {
                logger.warn(it.next());
            }
            return null;
        }
    }


    /**
     * 检索批定包名中包含所有的包javax.persistence.Entity的类，并进行解析
     * @param parkeName
     */
    public void scanAndParse(String parkeName) {
        logger.debug("开始从包{}中扫描到包含注解{}的实体......", parkeName, Entity.class);
        List<Class<?>> classes = ClassScanner.scan(parkeName, true, Entity.class);
        if (classes == null) {
            logger.info("从包{}中未扫描到包含注解{}的实体！！", parkeName, Entity.class);
            return;
        }
        for (Class<?> clazz : classes) {
            parseOne(clazz);
        }
    }


    private void parseOne(Class clazz) {
        if (!metaDataMap.containsKey(clazz.getName())) {
            metaDataMap.put(clazz.getName(), new MetaData().parse(clazz));
            if (logger.isDebugEnabled()) {
                logger.debug("success in parsing class:{}", clazz.getName());
                MetaData metaData = metaDataMap.get(clazz.getName());
                for (ColumnFieldMapping cfm : metaData.getColumnNames()) {
                    logger.debug("field:column >>>" + cfm.getFieldName() + ":" + cfm.getColumnName());
                }
            }
        }
    }


}
