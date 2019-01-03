package com.cpdaimler.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cpdaimler.domain.Car;
import com.cpdaimler.domain.CarIssue;
import com.cpdaimler.domain.enumeration.CARSTATUS;
import com.cpdaimler.service.CarIssueService;
import com.cpdaimler.service.CarService;
import com.cpdaimler.web.rest.errors.BadRequestAlertException;
import com.cpdaimler.web.rest.util.HeaderUtil;
import com.cpdaimler.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Car.
 */
@RestController
@RequestMapping("/api")
public class CarResource {

    private final Logger log = LoggerFactory.getLogger(CarResource.class);

    private static final String ENTITY_NAME = "car";

    private CarService carService;

    private CarIssueService carIssueService;

    public CarResource(CarService carService, CarIssueService carIssueService) {
        this.carService = carService;
        this.carIssueService = carIssueService;
    }

    /**
     * POST  /cars : Create a new car.
     *
     * @param car the car to create
     * @return the ResponseEntity with status 201 (Created) and with body the new car, or with status 400 (Bad Request) if the car has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/cars")
    @Timed
    public ResponseEntity<Car> createCar(@RequestBody Car car) throws URISyntaxException {
        log.debug("REST request to save Car : {}", car);
        if (car.getId() != null) {
            throw new BadRequestAlertException("A new car cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Car result = carService.save(car);
        return ResponseEntity.created(new URI("/api/cars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /cars : Updates an existing car.
     *
     * @param car the car to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated car,
     * or with status 400 (Bad Request) if the car is not valid,
     * or with status 500 (Internal Server Error) if the car couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/cars")
    @Timed
    public ResponseEntity<Car> updateCar(@RequestBody Car car) throws URISyntaxException {
        log.debug("REST request to update Car : {}", car);
        if (car.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Car result = carService.save(car);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, car.getId().toString()))
            .body(result);
    }

    /**
     * GET  /cars : get all the cars.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of cars in body
     */
    @GetMapping("/cars")
    @Timed
    public ResponseEntity<List<Car>> getAllCars(Pageable pageable) {
        log.debug("REST request to get a page of Cars");
        Page<Car> page = carService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/cars");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /cars : get all active the cars.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of cars in body
     */
    @GetMapping("/cars/active")
    @Timed
    public ResponseEntity<List<Car>> getAllActiveCars() {
        log.debug("REST request to get a page of Cars");
        List<Car> cars = carService.findAllActive();
        return new ResponseEntity<>(cars, HttpStatus.OK);
    }

    /**
     * GET  /cars/:id : get the "id" car.
     *
     * @param id the id of the car to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the car, or with status 404 (Not Found)
     */
    @GetMapping("/cars/{id}")
    @Timed
    public ResponseEntity<Car> getCar(@PathVariable Long id) {
        log.debug("REST request to get Car : {}", id);
        Optional<Car> car = carService.findOne(id);
        return ResponseUtil.wrapOrNotFound(car);
    }

    @GetMapping("/cars/status/available/number")
    @Timed
    public Long getNumberByStatusAvailable() {
        log.debug("REST request to get Car : {}");
        Long count = carService.countByCarStatus(CARSTATUS.AVAILABLE);
        return count;
    }
    @GetMapping("/cars/status/drivingFull/number")
    @Timed
    public Long getNumberByStatusDrivingFull() {
        log.debug("REST request to get Car : {}");
        Long count = carService.countByCarStatus(CARSTATUS.DRIVING_FULL);
        return count;
    }
    @GetMapping("/cars/status/maintenance/number")
    @Timed
    public Long getNumberByStatusMaintenance() {
        log.debug("REST request to get Car : {}");
        Long count = carService.countByCarStatus(CARSTATUS.MAINTENANCE);
        return count;
    }
    @GetMapping("/cars/status/drivingEmpty/number")
    @Timed
    public Long getNumberByStatusDrivingEmpty() {
        log.debug("REST request to get Car : {}");
        Long count = carService.countByCarStatus(CARSTATUS.DRIVING_EMPTY);
        return count;
    }
    @GetMapping("/cars/status/inactive/number")
    @Timed
    public Long getNumberByStatus() {
        log.debug("REST request to get Car : {}");
        Long count = carService.countByCarStatus(CARSTATUS.INACTIVE);
        return count;
    }

    /**
     * DELETE  /cars/:id : delete the "id" car.
     *
     * @param id the id of the car to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/cars/{id}")
    @Timed
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        log.debug("REST request to delete Car : {}", id);
        carService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/cars?query=:query : search for the car corresponding
     * to the query.
     *
     * @param query    the query of the car search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/cars")
    @Timed
    public ResponseEntity<List<Car>> searchCars(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Cars for query {}", query);
        Page<Car> page = carService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/cars");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping("/cars/{carId}/issues")
    @Timed
    public ResponseEntity<CarIssue> createCarIssueForCar(@PathVariable Long carId, @RequestBody CarIssue carIssue) throws URISyntaxException {
        log.debug("REST request to save CarIssue : {}", carIssue);
        if (carIssue.getId() != null) {
            throw new BadRequestAlertException("A new carIssue cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<Car> car = carService.findOne(carId);

        if (!car.isPresent()) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        carIssue.setCar(car.get());

        CarIssue result = carIssueService.save(carIssue);
        return ResponseEntity.created(new URI("/api/car-issues/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * GET  /car-issues/:id : get the "id" carIssue.
     *
     * @param carId the id of the carIssue to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the carIssue, or with status 404 (Not Found)
     */
    @GetMapping("/cars/{carId}/issues")
    @Timed
    public ResponseEntity<List<CarIssue>> getCarIssueByCarId(@PathVariable Long carId) {
        log.debug("REST request to get CarIssue for the car with the id : {}", carId);
        List<CarIssue> carIssues = carIssueService.findAllByCar(carId);
        return new ResponseEntity<List<CarIssue>>(carIssues, HttpStatus.OK);
    }
}
