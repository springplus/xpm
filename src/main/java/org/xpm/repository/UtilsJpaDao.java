package org.xpm.repository;


import org.hibernate.Session;
import org.hibernate.criterion.CriteriaSpecification;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Created by hongxueqian on 14-3-23.
 */
@Component
public class UtilsJpaDao {
    @PersistenceContext
    private EntityManager entityManager;

    public List query() {
        String sql = "select table_name as code ,TABLE_COMMENT as name from v_md_entity_unmanaged";
        Session session = entityManager.unwrap(org.hibernate.Session.class);
        List list = session.createQuery(sql).setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP).list();
//        Query query = entityManager.createNativeQuery(sql);
//        List list = query.getResultList();
//        Session session = entityManager.unwrap(org.hibernate.Session.class);
//        Query query = session.createQuery(sql);
//        query.setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP);
//        entityManager.setFlushMode(FlushModeType.COMMIT);
        return list;
    }
}
