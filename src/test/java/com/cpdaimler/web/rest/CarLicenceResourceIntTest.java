package com.cpdaimler.web.rest;

import com.cpdaimler.CpdaimlerApp;

import com.cpdaimler.domain.CarLicence;
import com.cpdaimler.repository.CarLicenceRepository;
import com.cpdaimler.repository.search.CarLicenceSearchRepository;
import com.cpdaimler.service.CarLicenceService;
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
import java.util.Collections;
import java.util.List;


import static com.cpdaimler.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cpdaimler.domain.enumeration.LICENCE;
/**
 * Test class for the CarLicenceResource REST controller.
 *
 * @see CarLicenceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CpdaimlerApp.class)
public class CarLicenceResourceIntTest {

    private static final LICENCE DEFAULT_CAR_LICENCE = LICENCE.A;
    private static final LICENCE UPDATED_CAR_LICENCE = LICENCE.B;

    @Autowired
    private CarLicenceRepository carLicenceRepository;
    
    @Autowired
    private CarLicenceService carLicenceService;

    /**
     * This repository is mocked in the com.cpdaimler.repository.search test package.
     *
     * @see com.cpdaimler.repository.search.CarLicenceSearchRepositoryMockConfiguration
     */
    @Autowired
    private CarLicenceSearchRepository mockCarLicenceSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCarLicenceMockMvc;

    private CarLicence carLicence;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CarLicenceResource carLicenceResource = new CarLicenceResource(carLicenceService);
        this.restCarLicenceMockMvc = MockMvcBuilders.standaloneSetup(carLicenceResource)
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
    public static CarLicence createEntity(EntityManager em) {
        CarLicence carLicence = new CarLicence()
            .carLicence(DEFAULT_CAR_LICENCE);
        return carLicence;
    }

    @Before
    public void initTest() {
        carLicence = createEntity(em);
    }

    @Test
    @Transactional
    public void createCarLicence() throws Exception {
        int databaseSizeBeforeCreate = carLicenceRepository.findAll().size();

        // Create the CarLicence
        restCarLicenceMockMvc.perform(post("/api/car-licences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carLicence)))
            .andExpect(status().isCreated());

        // Validate the CarLicence in the database
        List<CarLicence> carLicenceList = carLicenceRepository.findAll();
        assertThat(carLicenceList).hasSize(databaseSizeBeforeCreate + 1);
        CarLicence testCarLicence = carLicenceList.get(carLicenceList.size() - 1);
        assertThat(testCarLicence.getCarLicence()).isEqualTo(DEFAULT_CAR_LICENCE);

        // Validate the CarLicence in Elasticsearch
        verify(mockCarLicenceSearchRepository, times(1)).save(testCarLicence);
    }

    @Test
    @Transactional
    public void createCarLicenceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = carLicenceRepository.findAll().size();

        // Create the CarLicence with an existing ID
        carLicence.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCarLicenceMockMvc.perform(post("/api/car-licences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carLicence)))
            .andExpect(status().isBadRequest());

        // Validate the CarLicence in the database
        List<CarLicence> carLicenceList = carLicenceRepository.findAll();
        assertThat(carLicenceList).hasSize(databaseSizeBeforeCreate);

        // Validate the CarLicence in Elasticsearch
        verify(mockCarLicenceSearchRepository, times(0)).save(carLicence);
    }

    @Test
    @Transactional
    public void getAllCarLicences() throws Exception {
        // Initialize the database
        carLicenceRepository.saveAndFlush(carLicence);

        // Get all the carLicenceList
        restCarLicenceMockMvc.perform(get("/api/car-licences?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carLicence.getId().intValue())))
            .andExpect(jsonPath("$.[*].carLicence").value(hasItem(DEFAULT_CAR_LICENCE.toString())));
    }
    
    @Test
    @Transactional
    public void getCarLicence() throws Exception {
        // Initialize the database
        carLicenceRepository.saveAndFlush(carLicence);

        // Get the carLicence
        restCarLicenceMockMvc.perform(get("/api/car-licences/{id}", carLicence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(carLicence.getId().intValue()))
            .andExpect(jsonPath("$.carLicence").value(DEFAULT_CAR_LICENCE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCarLicence() throws Exception {
        // Get the carLicence
        restCarLicenceMockMvc.perform(get("/api/car-licences/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCarLicence() throws Exception {
        // Initialize the database
        carLicenceService.save(carLicence);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockCarLicenceSearchRepository);

        int databaseSizeBeforeUpdate = carLicenceRepository.findAll().size();

        // Update the carLicence
        CarLicence updatedCarLicence = carLicenceRepository.findById(carLicence.getId()).get();
        // Disconnect from session so that the updates on updatedCarLicence are not directly saved in db
        em.detach(updatedCarLicence);
        updatedCarLicence
            .carLicence(UPDATED_CAR_LICENCE);

        restCarLicenceMockMvc.perform(put("/api/car-licences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCarLicence)))
            .andExpect(status().isOk());

        // Validate the CarLicence in the database
        List<CarLicence> carLicenceList = carLicenceRepository.findAll();
        assertThat(carLicenceList).hasSize(databaseSizeBeforeUpdate);
        CarLicence testCarLicence = carLicenceList.get(carLicenceList.size() - 1);
        assertThat(testCarLicence.getCarLicence()).isEqualTo(UPDATED_CAR_LICENCE);

        // Validate the CarLicence in Elasticsearch
        verify(mockCarLicenceSearchRepository, times(1)).save(testCarLicence);
    }

    @Test
    @Transactional
    public void updateNonExistingCarLicence() throws Exception {
        int databaseSizeBeforeUpdate = carLicenceRepository.findAll().size();

        // Create the CarLicence

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarLicenceMockMvc.perform(put("/api/car-licences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(carLicence)))
            .andExpect(status().isBadRequest());

        // Validate the CarLicence in the database
        List<CarLicence> carLicenceList = carLicenceRepository.findAll();
        assertThat(carLicenceList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CarLicence in Elasticsearch
        verify(mockCarLicenceSearchRepository, times(0)).save(carLicence);
    }

    @Test
    @Transactional
    public void deleteCarLicence() throws Exception {
        // Initialize the database
        carLicenceService.save(carLicence);

        int databaseSizeBeforeDelete = carLicenceRepository.findAll().size();

        // Get the carLicence
        restCarLicenceMockMvc.perform(delete("/api/car-licences/{id}", carLicence.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CarLicence> carLicenceList = carLicenceRepository.findAll();
        assertThat(carLicenceList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CarLicence in Elasticsearch
        verify(mockCarLicenceSearchRepository, times(1)).deleteById(carLicence.getId());
    }

    @Test
    @Transactional
    public void searchCarLicence() throws Exception {
        // Initialize the database
        carLicenceService.save(carLicence);
        when(mockCarLicenceSearchRepository.search(queryStringQuery("id:" + carLicence.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(carLicence), PageRequest.of(0, 1), 1));
        // Search the carLicence
        restCarLicenceMockMvc.perform(get("/api/_search/car-licences?query=id:" + carLicence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carLicence.getId().intValue())))
            .andExpect(jsonPath("$.[*].carLicence").value(hasItem(DEFAULT_CAR_LICENCE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CarLicence.class);
        CarLicence carLicence1 = new CarLicence();
        carLicence1.setId(1L);
        CarLicence carLicence2 = new CarLicence();
        carLicence2.setId(carLicence1.getId());
        assertThat(carLicence1).isEqualTo(carLicence2);
        carLicence2.setId(2L);
        assertThat(carLicence1).isNotEqualTo(carLicence2);
        carLicence1.setId(null);
        assertThat(carLicence1).isNotEqualTo(carLicence2);
    }
}
