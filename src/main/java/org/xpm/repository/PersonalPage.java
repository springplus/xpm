package org.xpm.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by hongxueqian on 14-3-16.
 */
public interface PersonalPage extends PagingAndSortingRepository<PersonalPage,Long>{
    PersonalPage findByPageId(Long pageId);
}
