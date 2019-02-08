package com.cpdaimler.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cpdaimler.domain.CarCleanliness;
import com.cpdaimler.service.CarCleanlinessService;
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
 * REST controller for managing CarCleanliness.
 */
@RestController
@RequestMapping("/api")
public class CarCleanlinessResource {

    private final Logger log = LoggerFactory.getLogger(CarCleanlinessResource.class);

    private static final String ENTITY_NAME = "carCleanliness";

    private CarCleanlinessService carCleanlinessService;

    public CarCleanlinessResource(CarCleanlinessService carCleanlinessService) {
        this.carCleanlinessService = carCleanlinessService;
    }

    /**
     * POST  /car-cleanlinesses : Create a new carCleanliness.
     *
     * @param carCleanliness the carCleanliness to create
     * @return the ResponseEntity with status 201 (Created) and with body the new carCleanliness, or with status 400 (Bad Request) if the carCleanliness has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/car-cleanlinesses")
    @Timed
    public ResponseEntity<CarCleanliness> createCarCleanliness(@RequestBody CarCleanliness carCleanliness) throws URISyntaxException {
        log.debug("REST request to save CarCleanliness : {}", carCleanliness);
        if (carCleanliness.getId() != null) {
            throw new BadRequestAlertException("A new carCleanliness cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CarCleanliness result = carCleanlinessService.save(carCleanliness);
        return ResponseEntity.created(new URI("/api/car-cleanlinesses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /car-cleanlinesses : Updates an existing carCleanliness.
     *
     * @param carCleanliness the carCleanliness to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated carCleanliness,
     * or with status 400 (Bad Request) if the carCleanliness is not valid,
     * or with status 500 (Internal Server Error) if the carCleanliness couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/car-cleanlinesses")
    @Timed
    public ResponseEntity<CarCleanliness> updateCarCleanliness(@RequestBody CarCleanliness carCleanliness) throws URISyntaxException {
        log.debug("REST request to update CarCleanliness : {}", carCleanliness);
        if (carCleanliness.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CarCleanliness result = carCleanlinessService.save(carCleanliness);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, carCleanliness.getId().toString()))
            .body(result);
    }

    /**
     * GET  /car-cleanlinesses : get all the carCleanlinesses.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of carCleanlinesses in body
     */
    @GetMapping("/car-cleanlinesses")
    @Timed
    public ResponseEntity<List<CarCleanliness>> getAllCarCleanlinesses(Pageable pageable) {
        log.debug("REST request to get a page of CarCleanlinesses");
        Page<CarCleanliness> page = carCleanlinessService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/car-cleanlinesses");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /car-cleanlinesses/:id : get the "id" carCleanliness.
     *
     * @param id the id of the carCleanliness to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the carCleanliness, or with status 404 (Not Found)
     */
    @GetMapping("/car-cleanlinesses/{id}")
    @Timed
    public ResponseEntity<CarCleanliness> getCarCleanliness(@PathVariable Long id) {
        log.debug("REST request to get CarCleanliness : {}", id);
        Optional<CarCleanliness> carCleanliness = carCleanlinessService.findOne(id);
        return ResponseUtil.wrapOrNotFound(carCleanliness);
    }

    /**
     * DELETE  /car-cleanlinesses/:id : delete the "id" carCleanliness.
     *
     * @param id the id of the carCleanliness to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/car-cleanlinesses/{id}")
    @Timed
    public ResponseEntity<Void> deleteCarCleanliness(@PathVariable Long id) {
        log.debug("REST request to delete CarCleanliness : {}", id);
        carCleanlinessService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/car-cleanlinesses?query=:query : search for the carCleanliness corresponding
     * to the query.
     *
     * @param query the query of the carCleanliness search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/car-cleanlinesses")
    @Timed
    public ResponseEntity<List<CarCleanliness>> searchCarCleanlinesses(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of CarCleanlinesses for query {}", query);
        Page<CarCleanliness> page = carCleanlinessService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/car-cleanlinesses");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
