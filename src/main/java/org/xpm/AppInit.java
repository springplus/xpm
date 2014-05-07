package org.xpm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.xpm.core.orm.mybatis.MetaDataManager;

import javax.persistence.EntityManager;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;

/**
 * Created by hongxueqian on 14-3-23.
 */
public class AppInit {
    private static Logger logger = LoggerFactory.getLogger(AppInit.class);
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private MetaDataManager metaDataManager;

    public void init(){
        entityManager.setFlushMode(FlushModeType.COMMIT);
        logger.info("Set entityManger flushModeType to COMMIT.");

        metaDataManager.scanAndParse("org.xpm.entity");
        logger.info("Scan and parse entity metadata for mybatis.");

    }



}
