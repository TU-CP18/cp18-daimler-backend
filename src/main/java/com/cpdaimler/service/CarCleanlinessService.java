package com.cpdaimler.service;

import com.cpdaimler.domain.CarCleanliness;
import com.cpdaimler.repository.CarCleanlinessRepository;
import com.cpdaimler.repository.search.CarCleanlinessSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing CarCleanliness.
 */
@Service
@Transactional
public class CarCleanlinessService {

    private final Logger log = LoggerFactory.getLogger(CarCleanlinessService.class);

    private CarCleanlinessRepository carCleanlinessRepository;

    private CarCleanlinessSearchRepository carCleanlinessSearchRepository;

    public CarCleanlinessService(CarCleanlinessRepository carCleanlinessRepository, CarCleanlinessSearchRepository carCleanlinessSearchRepository) {
        this.carCleanlinessRepository = carCleanlinessRepository;
        this.carCleanlinessSearchRepository = carCleanlinessSearchRepository;
    }

    /**
     * Save a carCleanliness.
     *
     * @param carCleanliness the entity to save
     * @return the persisted entity
     */
    public CarCleanliness save(CarCleanliness carCleanliness) {
        log.debug("Request to save CarCleanliness : {}", carCleanliness);
        CarCleanliness result = carCleanlinessRepository.save(carCleanliness);
        carCleanlinessSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the carCleanlinesses.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CarCleanliness> findAll(Pageable pageable) {
        log.debug("Request to get all CarCleanlinesses");
        return carCleanlinessRepository.findAll(pageable);
    }


    /**
     * Get one carCleanliness by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<CarCleanliness> findOne(Long id) {
        log.debug("Request to get CarCleanliness : {}", id);
        return carCleanlinessRepository.findById(id);
    }

    /**
     * Delete the carCleanliness by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete CarCleanliness : {}", id);
        carCleanlinessRepository.deleteById(id);
        carCleanlinessSearchRepository.deleteById(id);
    }

    /**
     * Search for the carCleanliness corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CarCleanliness> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of CarCleanlinesses for query {}", query);
        return carCleanlinessSearchRepository.search(queryStringQuery(query), pageable);    }
}
