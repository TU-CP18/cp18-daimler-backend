package com.cpdaimler.repository.search;

import com.cpdaimler.domain.CarIssue;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CarIssue entity.
 */
public interface CarIssueSearchRepository extends ElasticsearchRepository<CarIssue, Long> {
}
