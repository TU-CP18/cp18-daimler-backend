package com.cpdaimler.web.rest;

import com.cpdaimler.CpdaimlerApp;

import com.cpdaimler.domain.SafetyDriver;
import com.cpdaimler.repository.SafetyDriverRepository;
import com.cpdaimler.repository.search.SafetyDriverSearchRepository;
import com.cpdaimler.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


import static com.cpdaimler.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SafetyDriverResource REST controller.
 *
 * @see SafetyDriverResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CpdaimlerApp.class)
public class SafetyDriverResourceIntTest {

    private static final String DEFAULT_LOGIN = "AAAAAAAAAA";
    private static final String UPDATED_LOGIN = "BBBBBBBBBB";

    @Autowired
    private SafetyDriverRepository safetyDriverRepository;

    @Mock
    private SafetyDriverRepository safetyDriverRepositoryMock;

    /**
     * This repository is mocked in the com.cpdaimler.repository.search test package.
     *
     * @see com.cpdaimler.repository.search.SafetyDriverSearchRepositoryMockConfiguration
     */
    @Autowired
    private SafetyDriverSearchRepository mockSafetyDriverSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSafetyDriverMockMvc;

    private SafetyDriver safetyDriver;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SafetyDriverResource safetyDriverResource = new SafetyDriverResource(safetyDriverRepository, mockSafetyDriverSearchRepository);
        this.restSafetyDriverMockMvc = MockMvcBuilders.standaloneSetup(safetyDriverResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SafetyDriver createEntity(EntityManager em) {
        SafetyDriver safetyDriver = new SafetyDriver()
            .login(DEFAULT_LOGIN);
        return safetyDriver;
    }

    @Before
    public void initTest() {
        safetyDriver = createEntity(em);
    }

    @Test
    @Transactional
    public void createSafetyDriver() throws Exception {
        int databaseSizeBeforeCreate = safetyDriverRepository.findAll().size();

        // Create the SafetyDriver
        restSafetyDriverMockMvc.perform(post("/api/safety-drivers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(safetyDriver)))
            .andExpect(status().isCreated());

        // Validate the SafetyDriver in the database
        List<SafetyDriver> safetyDriverList = safetyDriverRepository.findAll();
        assertThat(safetyDriverList).hasSize(databaseSizeBeforeCreate + 1);
        SafetyDriver testSafetyDriver = safetyDriverList.get(safetyDriverList.size() - 1);
        assertThat(testSafetyDriver.getLogin()).isEqualTo(DEFAULT_LOGIN);

        // Validate the SafetyDriver in Elasticsearch
        verify(mockSafetyDriverSearchRepository, times(1)).save(testSafetyDriver);
    }

    @Test
    @Transactional
    public void createSafetyDriverWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = safetyDriverRepository.findAll().size();

        // Create the SafetyDriver with an existing ID
        safetyDriver.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSafetyDriverMockMvc.perform(post("/api/safety-drivers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(safetyDriver)))
            .andExpect(status().isBadRequest());

        // Validate the SafetyDriver in the database
        List<SafetyDriver> safetyDriverList = safetyDriverRepository.findAll();
        assertThat(safetyDriverList).hasSize(databaseSizeBeforeCreate);

        // Validate the SafetyDriver in Elasticsearch
        verify(mockSafetyDriverSearchRepository, times(0)).save(safetyDriver);
    }

    @Test
    @Transactional
    public void checkLoginIsRequired() throws Exception {
        int databaseSizeBeforeTest = safetyDriverRepository.findAll().size();
        // set the field null
        safetyDriver.setLogin(null);

        // Create the SafetyDriver, which fails.

        restSafetyDriverMockMvc.perform(post("/api/safety-drivers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(safetyDriver)))
            .andExpect(status().isBadRequest());

        List<SafetyDriver> safetyDriverList = safetyDriverRepository.findAll();
        assertThat(safetyDriverList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSafetyDrivers() throws Exception {
        // Initialize the database
        safetyDriverRepository.saveAndFlush(safetyDriver);

        // Get all the safetyDriverList
        restSafetyDriverMockMvc.perform(get("/api/safety-drivers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(safetyDriver.getId().intValue())))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN.toString())));
    }
    
    public void getAllSafetyDriversWithEagerRelationshipsIsEnabled() throws Exception {
        SafetyDriverResource safetyDriverResource = new SafetyDriverResource(safetyDriverRepositoryMock, mockSafetyDriverSearchRepository);
        when(safetyDriverRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restSafetyDriverMockMvc = MockMvcBuilders.standaloneSetup(safetyDriverResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restSafetyDriverMockMvc.perform(get("/api/safety-drivers?eagerload=true"))
        .andExpect(status().isOk());

        verify(safetyDriverRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    public void getAllSafetyDriversWithEagerRelationshipsIsNotEnabled() throws Exception {
        SafetyDriverResource safetyDriverResource = new SafetyDriverResource(safetyDriverRepositoryMock, mockSafetyDriverSearchRepository);
            when(safetyDriverRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restSafetyDriverMockMvc = MockMvcBuilders.standaloneSetup(safetyDriverResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restSafetyDriverMockMvc.perform(get("/api/safety-drivers?eagerload=true"))
        .andExpect(status().isOk());

            verify(safetyDriverRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getSafetyDriver() throws Exception {
        // Initialize the database
        safetyDriverRepository.saveAndFlush(safetyDriver);

        // Get the safetyDriver
        restSafetyDriverMockMvc.perform(get("/api/safety-drivers/{id}", safetyDriver.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(safetyDriver.getId().intValue()))
            .andExpect(jsonPath("$.login").value(DEFAULT_LOGIN.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSafetyDriver() throws Exception {
        // Get the safetyDriver
        restSafetyDriverMockMvc.perform(get("/api/safety-drivers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSafetyDriver() throws Exception {
        // Initialize the database
        safetyDriverRepository.saveAndFlush(safetyDriver);

        int databaseSizeBeforeUpdate = safetyDriverRepository.findAll().size();

        // Update the safetyDriver
        SafetyDriver updatedSafetyDriver = safetyDriverRepository.findById(safetyDriver.getId()).get();
        // Disconnect from session so that the updates on updatedSafetyDriver are not directly saved in db
        em.detach(updatedSafetyDriver);
        updatedSafetyDriver
            .login(UPDATED_LOGIN);

        restSafetyDriverMockMvc.perform(put("/api/safety-drivers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSafetyDriver)))
            .andExpect(status().isOk());

        // Validate the SafetyDriver in the database
        List<SafetyDriver> safetyDriverList = safetyDriverRepository.findAll();
        assertThat(safetyDriverList).hasSize(databaseSizeBeforeUpdate);
        SafetyDriver testSafetyDriver = safetyDriverList.get(safetyDriverList.size() - 1);
        assertThat(testSafetyDriver.getLogin()).isEqualTo(UPDATED_LOGIN);

        // Validate the SafetyDriver in Elasticsearch
        verify(mockSafetyDriverSearchRepository, times(1)).save(testSafetyDriver);
    }

    @Test
    @Transactional
    public void updateNonExistingSafetyDriver() throws Exception {
        int databaseSizeBeforeUpdate = safetyDriverRepository.findAll().size();

        // Create the SafetyDriver

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSafetyDriverMockMvc.perform(put("/api/safety-drivers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(safetyDriver)))
            .andExpect(status().isBadRequest());

        // Validate the SafetyDriver in the database
        List<SafetyDriver> safetyDriverList = safetyDriverRepository.findAll();
        assertThat(safetyDriverList).hasSize(databaseSizeBeforeUpdate);

        // Validate the SafetyDriver in Elasticsearch
        verify(mockSafetyDriverSearchRepository, times(0)).save(safetyDriver);
    }

    @Test
    @Transactional
    public void deleteSafetyDriver() throws Exception {
        // Initialize the database
        safetyDriverRepository.saveAndFlush(safetyDriver);

        int databaseSizeBeforeDelete = safetyDriverRepository.findAll().size();

        // Get the safetyDriver
        restSafetyDriverMockMvc.perform(delete("/api/safety-drivers/{id}", safetyDriver.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SafetyDriver> safetyDriverList = safetyDriverRepository.findAll();
        assertThat(safetyDriverList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the SafetyDriver in Elasticsearch
        verify(mockSafetyDriverSearchRepository, times(1)).deleteById(safetyDriver.getId());
    }

    @Test
    @Transactional
    public void searchSafetyDriver() throws Exception {
        // Initialize the database
        safetyDriverRepository.saveAndFlush(safetyDriver);
        when(mockSafetyDriverSearchRepository.search(queryStringQuery("id:" + safetyDriver.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(safetyDriver), PageRequest.of(0, 1), 1));
        // Search the safetyDriver
        restSafetyDriverMockMvc.perform(get("/api/_search/safety-drivers?query=id:" + safetyDriver.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(safetyDriver.getId().intValue())))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SafetyDriver.class);
        SafetyDriver safetyDriver1 = new SafetyDriver();
        safetyDriver1.setId(1L);
        SafetyDriver safetyDriver2 = new SafetyDriver();
        safetyDriver2.setId(safetyDriver1.getId());
        assertThat(safetyDriver1).isEqualTo(safetyDriver2);
        safetyDriver2.setId(2L);
        assertThat(safetyDriver1).isNotEqualTo(safetyDriver2);
        safetyDriver1.setId(null);
        assertThat(safetyDriver1).isNotEqualTo(safetyDriver2);
    }
}
