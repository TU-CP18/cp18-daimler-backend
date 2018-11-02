package com.cpdaimler.repository.search;

import com.cpdaimler.domain.SafetyDriver;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SafetyDriver entity.
 */
public interface SafetyDriverSearchRepository extends ElasticsearchRepository<SafetyDriver, Long> {
}
