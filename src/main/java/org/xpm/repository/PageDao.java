package org.xpm.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.xpm.entity.Page;

/**
 * Created by hongxueqian on 14-3-16.
 */
public interface PageDao extends PagingAndSortingRepository<Page,Long>{

}
