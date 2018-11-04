package com.cpdaimler.service;

import com.cpdaimler.domain.CarLicence;
import com.cpdaimler.repository.CarLicenceRepository;
import com.cpdaimler.repository.search.CarLicenceSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing CarLicence.
 */
@Service
@Transactional
public class CarLicenceService {

    private final Logger log = LoggerFactory.getLogger(CarLicenceService.class);

    private CarLicenceRepository carLicenceRepository;

    private CarLicenceSearchRepository carLicenceSearchRepository;

    public CarLicenceService(CarLicenceRepository carLicenceRepository, CarLicenceSearchRepository carLicenceSearchRepository) {
        this.carLicenceRepository = carLicenceRepository;
        this.carLicenceSearchRepository = carLicenceSearchRepository;
    }

    /**
     * Save a carLicence.
     *
     * @param carLicence the entity to save
     * @return the persisted entity
     */
    public CarLicence save(CarLicence carLicence) {
        log.debug("Request to save CarLicence : {}", carLicence);
        CarLicence result = carLicenceRepository.save(carLicence);
        carLicenceSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the carLicences.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CarLicence> findAll(Pageable pageable) {
        log.debug("Request to get all CarLicences");
        return carLicenceRepository.findAll(pageable);
    }


    /**
     * Get one carLicence by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<CarLicence> findOne(Long id) {
        log.debug("Request to get CarLicence : {}", id);
        return carLicenceRepository.findById(id);
    }

    /**
     * Delete the carLicence by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete CarLicence : {}", id);
        carLicenceRepository.deleteById(id);
        carLicenceSearchRepository.deleteById(id);
    }

    /**
     * Search for the carLicence corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CarLicence> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of CarLicences for query {}", query);
        return carLicenceSearchRepository.search(queryStringQuery(query), pageable);    }
}
