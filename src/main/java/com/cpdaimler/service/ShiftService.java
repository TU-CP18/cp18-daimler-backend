package com.cpdaimler.service;

import com.cpdaimler.domain.SafetyDriver;
import com.cpdaimler.domain.Shift;
import com.cpdaimler.repository.SafetyDriverRepository;
import com.cpdaimler.repository.ShiftRepository;
import com.cpdaimler.repository.search.ShiftSearchRepository;
import com.cpdaimler.service.dto.Position;
import com.cpdaimler.service.util.UserToSafetyDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.Max;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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

    private UserToSafetyDriver userToSafetyDriver;

    public ShiftService(ShiftRepository shiftRepository, ShiftSearchRepository shiftSearchRepository, SafetyDriverRepository safetyDriverRepository, UserToSafetyDriver userToSafetyDriver) {
        this.shiftRepository = shiftRepository;
        this.shiftSearchRepository = shiftSearchRepository;
        this.safetyDriverRepository = safetyDriverRepository;
        this.userToSafetyDriver = userToSafetyDriver;
    }

    /**
     * Save a shift.
     *
     * @param shift the entity to save
     * @return the persisted entity
     */
    public Shift save(Shift shift) {
        log.debug("Request to save Shift : {}", shift);

        Long id = shift.getId();

        if (id == null) {
            id = -1L;
        }
        System.out.println(shift.getSafetyDriver());
        List<Shift> parallel = shiftRepository.findAllByCarOrSafetyDriverAndStartBetweenOrEndBetweenOrStartLessThanEqualAndEndGreaterThanEqual(id, shift.getCar(), shift.getSafetyDriver(), shift.getStart(), shift.getEnd());

        if (!parallel.isEmpty()) {
            return null;
        }
        System.out.println(shift.getSafetyDriver());
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

    public List<Shift> getParallelShifts(Long queryId, Long start, Long end) {

        Long id = queryId;

        if (id == null) {
            id = -1L;
        }

        return shiftRepository.findAllParallel(id, start, end);
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
     * Get one shift by id.
     *
     * @return the entity
     */
    @Transactional(readOnly = true)
    public List<Shift> findAllFull() {
        log.debug("Request to get Shift : {}");
        return shiftRepository.findAllBySafetyDriverNotNullAndCarNotNull();
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

    public Optional<Shift> findNextShift() {

        return shiftRepository.findFirstBySafetyDriverAndStartGreaterThanEqualOrderByStartAsc(userToSafetyDriver.getCustomerForUser().get(), System.currentTimeMillis());
    }

    public List<Shift> findAllShiftsForUser() {

        return shiftRepository.findAllBySafetyDriver(userToSafetyDriver.getCustomerForUser().get());
    }

    /**
     * Search for the shift corresponding to the query.
     *
     * @param query    the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Shift> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Shifts for query {}", query);
        return shiftSearchRepository.search(queryStringQuery(query), pageable);
    }

    public boolean authorizeShift(Position position) {

        Optional<Shift> optNextShift = findNextShift();

        if (!optNextShift.isPresent()) {
            return false;
        } else {

            Shift nextShift = optNextShift.get();

            if ((((nextShift.getLatStart() - position.getLatitude()) >= -0.01) && ((nextShift.getLatStart() - position.getLatitude()) <= 0.01)) && (((nextShift.getLongStart() - position.getLongitude()) <= 0.1) && ((nextShift.getLongStart() - position.getLongitude()) >= -0.1))) {
                return true;
            }
        }
        return true;
    }


}
