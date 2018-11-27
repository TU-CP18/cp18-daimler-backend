package com.cpdaimler.service;

import com.cpdaimler.domain.Shift;
import com.cpdaimler.repository.SafetyDriverRepository;
import com.cpdaimler.repository.ShiftRepository;
import com.cpdaimler.repository.search.ShiftSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Shift.
 */
@Service
@Transactional
public class ShiftService {

    private final Logger log = LoggerFactory.getLogger(ShiftService.class);

    private ShiftRepository shiftRepository;

    private ShiftSearchRepository shiftSearchRepository;

    private SafetyDriverRepository safetyDriverRepository;

    public ShiftService(ShiftRepository shiftRepository, ShiftSearchRepository shiftSearchRepository, SafetyDriverRepository safetyDriverRepository) {
        this.shiftRepository = shiftRepository;
        this.shiftSearchRepository = shiftSearchRepository;
        this.safetyDriverRepository=safetyDriverRepository;
    }

    /**
     * Save a shift.
     *
     * @param shift the entity to save
     * @return the persisted entity
     */
    public Shift save(Shift shift) {
        log.debug("Request to save Shift : {}", shift);
        Shift result = shiftRepository.save(shift);
        shiftSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the shifts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Shift> findAll(Pageable pageable) {
        log.debug("Request to get all Shifts");
        return shiftRepository.findAll(pageable);
    }


    /**
     * Get one shift by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Shift> findOne(Long id) {
        log.debug("Request to get Shift : {}", id);
        return shiftRepository.findById(id);
    }

    /**
     * Delete the shift by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Shift : {}", id);
        shiftRepository.deleteById(id);
        shiftSearchRepository.deleteById(id);
    }

    public Optional<Shift> findNextShift(Long userId) {

        return shiftRepository.findOneBySafetyDriver(safetyDriverRepository.findById(userId).get());
    }

    /**
     * Search for the shift corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Shift> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Shifts for query {}", query);
        return shiftSearchRepository.search(queryStringQuery(query), pageable);    }


}
