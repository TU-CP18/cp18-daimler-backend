package com.cpdaimler.repository.search;

import com.cpdaimler.domain.Shift;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Shift entity.
 */
public interface ShiftSearchRepository extends ElasticsearchRepository<Shift, Long> {
}
