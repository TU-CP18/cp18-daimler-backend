package com.cpdaimler.web.rest;

import com.cpdaimler.CpdaimlerApp;

import com.cpdaimler.domain.CarCleanliness;
import com.cpdaimler.repository.CarCleanlinessRepository;
import com.cpdaimler.repository.search.CarCleanlinessSearchRepository;
import com.cpdaimler.service.CarCleanlinessService;
import com.cpdaimler.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.cpdaimler.web.rest.TestUtil.sameInstant;
import static com.cpdaimler.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CarCleanlinessResource REST controller.
 *
 * @see CarCleanlinessResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CpdaimlerApp.class)
public class CarCleanlinessResourceIntTest {

    private static final Double DEFAULT_RATING = 1D;
    private static final Double UPDATED_RATING = 2D;

    private static final String DEFAULT_EVENT = "AAAAAAAAAA";
    private static final String UPDATED_EVENT = "BBBBBBBBBB";

    private static final String DEFAULT_PART = "AAAAAAAAAA";
    private static final String UPDATED_PART = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private CarCleanlinessRepository carCleanlinessRepository;
    
    @Autowired
    private CarCleanlinessService carCleanlinessService;

    /**
     * This repository is mocked in the com.cpdaimler.repository.search test package.
     *
     * @see com.cpdaimler.repository.search.CarCleanlinessSearchRepositoryMockConfiguration
     */
    @Autowired
    private CarCleanlinessSearchRepository mockCarCleanlinessSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCarCleanlinessMockMvc;

    private CarCleanliness carCleanliness;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CarCleanlinessResource carCleanlinessResource = new CarCleanlinessResource(carCleanlinessService);
        this.restCarCleanlinessMockMvc = MockMvcBuilders.standaloneSetup(carCleanlinessResource)
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
    public static CarCleanliness createEntity(EntityManager em) {
        CarCleanliness carCleanliness = new CarCleanliness()
            .rating(DEFAULT_RATING)
            .event(DEFAULT_EVENT)
            .part(DEFAULT_PART)
            .createdAt(DEFAULT_CREATED_AT);
        return carCleanliness;
    }

    @Before
    public void initTest() {
        carCleanliness = createEntity(em);
    }

    @Test
    @Transactional
    public void createCarCleanliness() throws Exception {
        int databaseSizeBeforeCreate = carCleanlinessRepository.findAll().size();

        // Create the CarCleanliness
        restCarCleanlinessMockMvc.perform(post("/api/car-cleanlinesses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carCleanliness)))
            .andExpect(status().isCreated());

        // Validate the CarCleanliness in the database
        List<CarCleanliness> carCleanlinessList = carCleanlinessRepository.findAll();
        assertThat(carCleanlinessList).hasSize(databaseSizeBeforeCreate + 1);
        CarCleanliness testCarCleanliness = carCleanlinessList.get(carCleanlinessList.size() - 1);
        assertThat(testCarCleanliness.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testCarCleanliness.getEvent()).isEqualTo(DEFAULT_EVENT);
        assertThat(testCarCleanliness.getPart()).isEqualTo(DEFAULT_PART);
        assertThat(testCarCleanliness.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);

        // Validate the CarCleanliness in Elasticsearch
        verify(mockCarCleanlinessSearchRepository, times(1)).save(testCarCleanliness);
    }

    @Test
    @Transactional
    public void createCarCleanlinessWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = carCleanlinessRepository.findAll().size();

        // Create the CarCleanliness with an existing ID
        carCleanliness.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCarCleanlinessMockMvc.perform(post("/api/car-cleanlinesses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carCleanliness)))
            .andExpect(status().isBadRequest());

        // Validate the CarCleanliness in the database
        List<CarCleanliness> carCleanlinessList = carCleanlinessRepository.findAll();
        assertThat(carCleanlinessList).hasSize(databaseSizeBeforeCreate);

        // Validate the CarCleanliness in Elasticsearch
        verify(mockCarCleanlinessSearchRepository, times(0)).save(carCleanliness);
    }

    @Test
    @Transactional
    public void getAllCarCleanlinesses() throws Exception {
        // Initialize the database
        carCleanlinessRepository.saveAndFlush(carCleanliness);

        // Get all the carCleanlinessList
        restCarCleanlinessMockMvc.perform(get("/api/car-cleanlinesses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carCleanliness.getId().intValue())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING.doubleValue())))
            .andExpect(jsonPath("$.[*].event").value(hasItem(DEFAULT_EVENT.toString())))
            .andExpect(jsonPath("$.[*].part").value(hasItem(DEFAULT_PART.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }
    
    @Test
    @Transactional
    public void getCarCleanliness() throws Exception {
        // Initialize the database
        carCleanlinessRepository.saveAndFlush(carCleanliness);

        // Get the carCleanliness
        restCarCleanlinessMockMvc.perform(get("/api/car-cleanlinesses/{id}", carCleanliness.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(carCleanliness.getId().intValue()))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING.doubleValue()))
            .andExpect(jsonPath("$.event").value(DEFAULT_EVENT.toString()))
            .andExpect(jsonPath("$.part").value(DEFAULT_PART.toString()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)));
    }

    @Test
    @Transactional
    public void getNonExistingCarCleanliness() throws Exception {
        // Get the carCleanliness
        restCarCleanlinessMockMvc.perform(get("/api/car-cleanlinesses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCarCleanliness() throws Exception {
        // Initialize the database
        carCleanlinessService.save(carCleanliness);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockCarCleanlinessSearchRepository);

        int databaseSizeBeforeUpdate = carCleanlinessRepository.findAll().size();

        // Update the carCleanliness
        CarCleanliness updatedCarCleanliness = carCleanlinessRepository.findById(carCleanliness.getId()).get();
        // Disconnect from session so that the updates on updatedCarCleanliness are not directly saved in db
        em.detach(updatedCarCleanliness);
        updatedCarCleanliness
            .rating(UPDATED_RATING)
            .event(UPDATED_EVENT)
            .part(UPDATED_PART)
            .createdAt(UPDATED_CREATED_AT);

        restCarCleanlinessMockMvc.perform(put("/api/car-cleanlinesses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCarCleanliness)))
            .andExpect(status().isOk());

        // Validate the CarCleanliness in the database
        List<CarCleanliness> carCleanlinessList = carCleanlinessRepository.findAll();
        assertThat(carCleanlinessList).hasSize(databaseSizeBeforeUpdate);
        CarCleanliness testCarCleanliness = carCleanlinessList.get(carCleanlinessList.size() - 1);
        assertThat(testCarCleanliness.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testCarCleanliness.getEvent()).isEqualTo(UPDATED_EVENT);
        assertThat(testCarCleanliness.getPart()).isEqualTo(UPDATED_PART);
        assertThat(testCarCleanliness.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);

        // Validate the CarCleanliness in Elasticsearch
        verify(mockCarCleanlinessSearchRepository, times(1)).save(testCarCleanliness);
    }

    @Test
    @Transactional
    public void updateNonExistingCarCleanliness() throws Exception {
        int databaseSizeBeforeUpdate = carCleanlinessRepository.findAll().size();

        // Create the CarCleanliness

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarCleanlinessMockMvc.perform(put("/api/car-cleanlinesses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carCleanliness)))
            .andExpect(status().isBadRequest());

        // Validate the CarCleanliness in the database
        List<CarCleanliness> carCleanlinessList = carCleanlinessRepository.findAll();
        assertThat(carCleanlinessList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CarCleanliness in Elasticsearch
        verify(mockCarCleanlinessSearchRepository, times(0)).save(carCleanliness);
    }

    @Test
    @Transactional
    public void deleteCarCleanliness() throws Exception {
        // Initialize the database
        carCleanlinessService.save(carCleanliness);

        int databaseSizeBeforeDelete = carCleanlinessRepository.findAll().size();

        // Get the carCleanliness
        restCarCleanlinessMockMvc.perform(delete("/api/car-cleanlinesses/{id}", carCleanliness.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CarCleanliness> carCleanlinessList = carCleanlinessRepository.findAll();
        assertThat(carCleanlinessList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CarCleanliness in Elasticsearch
        verify(mockCarCleanlinessSearchRepository, times(1)).deleteById(carCleanliness.getId());
    }

    @Test
    @Transactional
    public void searchCarCleanliness() throws Exception {
        // Initialize the database
        carCleanlinessService.save(carCleanliness);
        when(mockCarCleanlinessSearchRepository.search(queryStringQuery("id:" + carCleanliness.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(carCleanliness), PageRequest.of(0, 1), 1));
        // Search the carCleanliness
        restCarCleanlinessMockMvc.perform(get("/api/_search/car-cleanlinesses?query=id:" + carCleanliness.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carCleanliness.getId().intValue())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING.doubleValue())))
            .andExpect(jsonPath("$.[*].event").value(hasItem(DEFAULT_EVENT.toString())))
            .andExpect(jsonPath("$.[*].part").value(hasItem(DEFAULT_PART.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CarCleanliness.class);
        CarCleanliness carCleanliness1 = new CarCleanliness();
        carCleanliness1.setId(1L);
        CarCleanliness carCleanliness2 = new CarCleanliness();
        carCleanliness2.setId(carCleanliness1.getId());
        assertThat(carCleanliness1).isEqualTo(carCleanliness2);
        carCleanliness2.setId(2L);
        assertThat(carCleanliness1).isNotEqualTo(carCleanliness2);
        carCleanliness1.setId(null);
        assertThat(carCleanliness1).isNotEqualTo(carCleanliness2);
    }
}
