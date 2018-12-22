package com.cpdaimler.service;

import com.cpdaimler.domain.Car;
import com.cpdaimler.domain.CarIssue;
import com.cpdaimler.repository.CarIssueRepository;
import com.cpdaimler.repository.CarRepository;
import com.cpdaimler.repository.search.CarIssueSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing CarIssue.
 */
@Service
@Transactional
public class CarIssueService {

    private final Logger log = LoggerFactory.getLogger(CarIssueService.class);

    private CarIssueRepository carIssueRepository;

    private CarIssueSearchRepository carIssueSearchRepository;

    private CarRepository carRepository;

    public CarIssueService(CarIssueRepository carIssueRepository, CarIssueSearchRepository carIssueSearchRepository, CarRepository carRepository) {
        this.carIssueRepository = carIssueRepository;
        this.carIssueSearchRepository = carIssueSearchRepository;
        this.carRepository = carRepository;
    }

    /**
     * Save a carIssue.
     *
     * @param carIssue the entity to save
     * @return the persisted entity
     */
    public CarIssue save(CarIssue carIssue) {
        log.debug("Request to save CarIssue : {}", carIssue);
        CarIssue result = carIssueRepository.save(carIssue);
        carIssueSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the carIssues.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CarIssue> findAll(Pageable pageable) {
        log.debug("Request to get all CarIssues");
        return carIssueRepository.findAll(pageable);
    }


    /**
     * Get one carIssue by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<CarIssue> findOne(Long id) {
        log.debug("Request to get CarIssue : {}", id);
        return carIssueRepository.findById(id);
    }

    /**
     * Get one carIssue by id.
     *
     * @param carId the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public List<CarIssue> findAllByCar(Long carId) {

        Optional<Car> car= carRepository.findById(carId);

        if(!car.isPresent()) {
            return null;
        }

        return carIssueRepository.findAllByCar(car.get());
    }

    /**
     * Delete the carIssue by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete CarIssue : {}", id);
        carIssueRepository.deleteById(id);
        carIssueSearchRepository.deleteById(id);
    }

    /**
     * Search for the carIssue corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CarIssue> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of CarIssues for query {}", query);
        return carIssueSearchRepository.search(queryStringQuery(query), pageable);    }
}
