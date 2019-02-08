package com.cpdaimler.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of CarCleanlinessSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CarCleanlinessSearchRepositoryMockConfiguration {

    @MockBean
    private CarCleanlinessSearchRepository mockCarCleanlinessSearchRepository;

}
