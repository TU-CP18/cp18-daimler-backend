package com.cpdaimler.repository.search;

import com.cpdaimler.domain.CarLicence;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CarLicence entity.
 */
public interface CarLicenceSearchRepository extends ElasticsearchRepository<CarLicence, Long> {
}
