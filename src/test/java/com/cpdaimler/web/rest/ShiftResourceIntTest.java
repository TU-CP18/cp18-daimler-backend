package com.cpdaimler.web.rest;

import com.cpdaimler.CpdaimlerApp;

import com.cpdaimler.domain.Shift;
import com.cpdaimler.repository.ShiftRepository;
import com.cpdaimler.repository.search.ShiftSearchRepository;
import com.cpdaimler.service.ShiftService;
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

/**
 * Test class for the ShiftResource REST controller.
 *
 * @see ShiftResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CpdaimlerApp.class)
public class ShiftResourceIntTest {

    private static final Long DEFAULT_START = 1L;
    private static final Long UPDATED_START = 2L;

    private static final Long DEFAULT_END = 1L;
    private static final Long UPDATED_END = 2L;

    @Autowired
    private ShiftRepository shiftRepository;
    
    @Autowired
    private ShiftService shiftService;

    /**
     * This repository is mocked in the com.cpdaimler.repository.search test package.
     *
     * @see com.cpdaimler.repository.search.ShiftSearchRepositoryMockConfiguration
     */
    @Autowired
    private ShiftSearchRepository mockShiftSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restShiftMockMvc;

    private Shift shift;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ShiftResource shiftResource = new ShiftResource(shiftService);
        this.restShiftMockMvc = MockMvcBuilders.standaloneSetup(shiftResource)
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
    public static Shift createEntity(EntityManager em) {
        Shift shift = new Shift()
            .start(DEFAULT_START)
            .end(DEFAULT_END);
        return shift;
    }

    @Before
    public void initTest() {
        shift = createEntity(em);
    }

    @Test
    @Transactional
    public void createShift() throws Exception {
        int databaseSizeBeforeCreate = shiftRepository.findAll().size();

        // Create the Shift
        restShiftMockMvc.perform(post("/api/shifts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isCreated());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeCreate + 1);
        Shift testShift = shiftList.get(shiftList.size() - 1);
        assertThat(testShift.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testShift.getEnd()).isEqualTo(DEFAULT_END);

        // Validate the Shift in Elasticsearch
        verify(mockShiftSearchRepository, times(1)).save(testShift);
    }

    @Test
    @Transactional
    public void createShiftWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shiftRepository.findAll().size();

        // Create the Shift with an existing ID
        shift.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShiftMockMvc.perform(post("/api/shifts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isBadRequest());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeCreate);

        // Validate the Shift in Elasticsearch
        verify(mockShiftSearchRepository, times(0)).save(shift);
    }

    @Test
    @Transactional
    public void checkStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = shiftRepository.findAll().size();
        // set the field null
        shift.setStart(null);

        // Create the Shift, which fails.

        restShiftMockMvc.perform(post("/api/shifts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isBadRequest());

        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = shiftRepository.findAll().size();
        // set the field null
        shift.setEnd(null);

        // Create the Shift, which fails.

        restShiftMockMvc.perform(post("/api/shifts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isBadRequest());

        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllShifts() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        // Get all the shiftList
        restShiftMockMvc.perform(get("/api/shifts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shift.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.intValue())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.intValue())));
    }
    
    @Test
    @Transactional
    public void getShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        // Get the shift
        restShiftMockMvc.perform(get("/api/shifts/{id}", shift.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shift.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.intValue()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingShift() throws Exception {
        // Get the shift
        restShiftMockMvc.perform(get("/api/shifts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShift() throws Exception {
        // Initialize the database
        shiftService.save(shift);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockShiftSearchRepository);

        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();

        // Update the shift
        Shift updatedShift = shiftRepository.findById(shift.getId()).get();
        // Disconnect from session so that the updates on updatedShift are not directly saved in db
        em.detach(updatedShift);
        updatedShift
            .start(UPDATED_START)
            .end(UPDATED_END);

        restShiftMockMvc.perform(put("/api/shifts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedShift)))
            .andExpect(status().isOk());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);
        Shift testShift = shiftList.get(shiftList.size() - 1);
        assertThat(testShift.getStart()).isEqualTo(UPDATED_START);
        assertThat(testShift.getEnd()).isEqualTo(UPDATED_END);

        // Validate the Shift in Elasticsearch
        verify(mockShiftSearchRepository, times(1)).save(testShift);
    }

    @Test
    @Transactional
    public void updateNonExistingShift() throws Exception {
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();

        // Create the Shift

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShiftMockMvc.perform(put("/api/shifts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shift)))
            .andExpect(status().isBadRequest());

        // Validate the Shift in the database
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Shift in Elasticsearch
        verify(mockShiftSearchRepository, times(0)).save(shift);
    }

    @Test
    @Transactional
    public void deleteShift() throws Exception {
        // Initialize the database
        shiftService.save(shift);

        int databaseSizeBeforeDelete = shiftRepository.findAll().size();

        // Get the shift
        restShiftMockMvc.perform(delete("/api/shifts/{id}", shift.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Shift> shiftList = shiftRepository.findAll();
        assertThat(shiftList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Shift in Elasticsearch
        verify(mockShiftSearchRepository, times(1)).deleteById(shift.getId());
    }

    @Test
    @Transactional
    public void searchShift() throws Exception {
        // Initialize the database
        shiftService.save(shift);
        when(mockShiftSearchRepository.search(queryStringQuery("id:" + shift.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(shift), PageRequest.of(0, 1), 1));
        // Search the shift
        restShiftMockMvc.perform(get("/api/_search/shifts?query=id:" + shift.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shift.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.intValue())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Shift.class);
        Shift shift1 = new Shift();
        shift1.setId(1L);
        Shift shift2 = new Shift();
        shift2.setId(shift1.getId());
        assertThat(shift1).isEqualTo(shift2);
        shift2.setId(2L);
        assertThat(shift1).isNotEqualTo(shift2);
        shift1.setId(null);
        assertThat(shift1).isNotEqualTo(shift2);
    }
}
