package com.cpdaimler.web.rest;

import com.cpdaimler.CpdaimlerApp;

import com.cpdaimler.domain.CarIssue;
import com.cpdaimler.repository.CarIssueRepository;
import com.cpdaimler.repository.search.CarIssueSearchRepository;
import com.cpdaimler.service.CarIssueService;
import com.cpdaimler.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
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
 * Test class for the CarIssueResource REST controller.
 *
 * @see CarIssueResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CpdaimlerApp.class)
@Ignore
public class CarIssueResourceIntTest {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PART = "AAAAAAAAAA";
    private static final String UPDATED_PART = "BBBBBBBBBB";

    private static final Double DEFAULT_POS_X = 1D;
    private static final Double UPDATED_POS_X = 2D;

    private static final Double DEFAULT_POS_Y = 1D;
    private static final Double UPDATED_POS_Y = 2D;

    @Autowired
    private CarIssueRepository carIssueRepository;
    
    @Autowired
    private CarIssueService carIssueService;

    /**
     * This repository is mocked in the com.cpdaimler.repository.search test package.
     *
     * @see com.cpdaimler.repository.search.CarIssueSearchRepositoryMockConfiguration
     */
    @Autowired
    private CarIssueSearchRepository mockCarIssueSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCarIssueMockMvc;

    private CarIssue carIssue;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CarIssueResource carIssueResource = new CarIssueResource(carIssueService);
        this.restCarIssueMockMvc = MockMvcBuilders.standaloneSetup(carIssueResource)
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
    public static CarIssue createEntity(EntityManager em) {
        CarIssue carIssue = new CarIssue()
            .description(DEFAULT_DESCRIPTION)
            .part(DEFAULT_PART)
            .posX(DEFAULT_POS_X)
            .posY(DEFAULT_POS_Y);
        return carIssue;
    }

    @Before
    public void initTest() {
        carIssue = createEntity(em);
    }

    @Test
    @Transactional
    public void createCarIssue() throws Exception {
        int databaseSizeBeforeCreate = carIssueRepository.findAll().size();

        // Create the CarIssue
        restCarIssueMockMvc.perform(post("/api/car-issues")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carIssue)))
            .andExpect(status().isCreated());

        // Validate the CarIssue in the database
        List<CarIssue> carIssueList = carIssueRepository.findAll();
        assertThat(carIssueList).hasSize(databaseSizeBeforeCreate + 1);
        CarIssue testCarIssue = carIssueList.get(carIssueList.size() - 1);
        assertThat(testCarIssue.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCarIssue.getPart()).isEqualTo(DEFAULT_PART);
        assertThat(testCarIssue.getPosX()).isEqualTo(DEFAULT_POS_X);
        assertThat(testCarIssue.getPosY()).isEqualTo(DEFAULT_POS_Y);

        // Validate the CarIssue in Elasticsearch
        verify(mockCarIssueSearchRepository, times(1)).save(testCarIssue);
    }

    @Test
    @Transactional
    public void createCarIssueWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = carIssueRepository.findAll().size();

        // Create the CarIssue with an existing ID
        carIssue.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCarIssueMockMvc.perform(post("/api/car-issues")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carIssue)))
            .andExpect(status().isBadRequest());

        // Validate the CarIssue in the database
        List<CarIssue> carIssueList = carIssueRepository.findAll();
        assertThat(carIssueList).hasSize(databaseSizeBeforeCreate);

        // Validate the CarIssue in Elasticsearch
        verify(mockCarIssueSearchRepository, times(0)).save(carIssue);
    }

    @Test
    @Transactional
    public void getAllCarIssues() throws Exception {
        // Initialize the database
        carIssueRepository.saveAndFlush(carIssue);

        // Get all the carIssueList
        restCarIssueMockMvc.perform(get("/api/car-issues?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carIssue.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].part").value(hasItem(DEFAULT_PART.toString())))
            .andExpect(jsonPath("$.[*].posX").value(hasItem(DEFAULT_POS_X.doubleValue())))
            .andExpect(jsonPath("$.[*].posY").value(hasItem(DEFAULT_POS_Y.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getCarIssue() throws Exception {
        // Initialize the database
        carIssueRepository.saveAndFlush(carIssue);

        // Get the carIssue
        restCarIssueMockMvc.perform(get("/api/car-issues/{id}", carIssue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(carIssue.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.part").value(DEFAULT_PART.toString()))
            .andExpect(jsonPath("$.posX").value(DEFAULT_POS_X.doubleValue()))
            .andExpect(jsonPath("$.posY").value(DEFAULT_POS_Y.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingCarIssue() throws Exception {
        // Get the carIssue
        restCarIssueMockMvc.perform(get("/api/car-issues/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCarIssue() throws Exception {
        // Initialize the database
        carIssueService.save(carIssue);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockCarIssueSearchRepository);

        int databaseSizeBeforeUpdate = carIssueRepository.findAll().size();

        // Update the carIssue
        CarIssue updatedCarIssue = carIssueRepository.findById(carIssue.getId()).get();
        // Disconnect from session so that the updates on updatedCarIssue are not directly saved in db
        em.detach(updatedCarIssue);
        updatedCarIssue
            .description(UPDATED_DESCRIPTION)
            .part(UPDATED_PART)
            .posX(UPDATED_POS_X)
            .posY(UPDATED_POS_Y);

        restCarIssueMockMvc.perform(put("/api/car-issues")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCarIssue)))
            .andExpect(status().isOk());

        // Validate the CarIssue in the database
        List<CarIssue> carIssueList = carIssueRepository.findAll();
        assertThat(carIssueList).hasSize(databaseSizeBeforeUpdate);
        CarIssue testCarIssue = carIssueList.get(carIssueList.size() - 1);
        assertThat(testCarIssue.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCarIssue.getPart()).isEqualTo(UPDATED_PART);
        assertThat(testCarIssue.getPosX()).isEqualTo(UPDATED_POS_X);
        assertThat(testCarIssue.getPosY()).isEqualTo(UPDATED_POS_Y);

        // Validate the CarIssue in Elasticsearch
        verify(mockCarIssueSearchRepository, times(1)).save(testCarIssue);
    }

    @Test
    @Transactional
    public void updateNonExistingCarIssue() throws Exception {
        int databaseSizeBeforeUpdate = carIssueRepository.findAll().size();

        // Create the CarIssue

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarIssueMockMvc.perform(put("/api/car-issues")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carIssue)))
            .andExpect(status().isBadRequest());

        // Validate the CarIssue in the database
        List<CarIssue> carIssueList = carIssueRepository.findAll();
        assertThat(carIssueList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CarIssue in Elasticsearch
        verify(mockCarIssueSearchRepository, times(0)).save(carIssue);
    }

    @Test
    @Transactional
    public void deleteCarIssue() throws Exception {
        // Initialize the database
        carIssueService.save(carIssue);

        int databaseSizeBeforeDelete = carIssueRepository.findAll().size();

        // Get the carIssue
        restCarIssueMockMvc.perform(delete("/api/car-issues/{id}", carIssue.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CarIssue> carIssueList = carIssueRepository.findAll();
        assertThat(carIssueList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CarIssue in Elasticsearch
        verify(mockCarIssueSearchRepository, times(1)).deleteById(carIssue.getId());
    }

    @Test
    @Transactional
    public void searchCarIssue() throws Exception {
        // Initialize the database
        carIssueService.save(carIssue);
        when(mockCarIssueSearchRepository.search(queryStringQuery("id:" + carIssue.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(carIssue), PageRequest.of(0, 1), 1));
        // Search the carIssue
        restCarIssueMockMvc.perform(get("/api/_search/car-issues?query=id:" + carIssue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carIssue.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].part").value(hasItem(DEFAULT_PART.toString())))
            .andExpect(jsonPath("$.[*].posX").value(hasItem(DEFAULT_POS_X.doubleValue())))
            .andExpect(jsonPath("$.[*].posY").value(hasItem(DEFAULT_POS_Y.doubleValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CarIssue.class);
        CarIssue carIssue1 = new CarIssue();
        carIssue1.setId(1L);
        CarIssue carIssue2 = new CarIssue();
        carIssue2.setId(carIssue1.getId());
        assertThat(carIssue1).isEqualTo(carIssue2);
        carIssue2.setId(2L);
        assertThat(carIssue1).isNotEqualTo(carIssue2);
        carIssue1.setId(null);
        assertThat(carIssue1).isNotEqualTo(carIssue2);
    }
}
