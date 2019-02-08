package com.cpdaimler.repository.search;

import com.cpdaimler.domain.CarCleanliness;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CarCleanliness entity.
 */
public interface CarCleanlinessSearchRepository extends ElasticsearchRepository<CarCleanliness, Long> {
}
