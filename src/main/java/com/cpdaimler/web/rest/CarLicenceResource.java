package com.cpdaimler.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cpdaimler.domain.CarLicence;
import com.cpdaimler.repository.CarLicenceRepository;
import com.cpdaimler.repository.search.CarLicenceSearchRepository;
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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing CarLicence.
 */
@RestController
@RequestMapping("/api")
public class CarLicenceResource {

    private final Logger log = LoggerFactory.getLogger(CarLicenceResource.class);

    private static final String ENTITY_NAME = "carLicence";

    private CarLicenceRepository carLicenceRepository;

    private CarLicenceSearchRepository carLicenceSearchRepository;

    public CarLicenceResource(CarLicenceRepository carLicenceRepository, CarLicenceSearchRepository carLicenceSearchRepository) {
        this.carLicenceRepository = carLicenceRepository;
        this.carLicenceSearchRepository = carLicenceSearchRepository;
    }

    /**
     * POST  /car-licences : Create a new carLicence.
     *
     * @param carLicence the carLicence to create
     * @return the ResponseEntity with status 201 (Created) and with body the new carLicence, or with status 400 (Bad Request) if the carLicence has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/car-licences")
    @Timed
    public ResponseEntity<CarLicence> createCarLicence(@RequestBody CarLicence carLicence) throws URISyntaxException {
        log.debug("REST request to save CarLicence : {}", carLicence);
        if (carLicence.getId() != null) {
            throw new BadRequestAlertException("A new carLicence cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CarLicence result = carLicenceRepository.save(carLicence);
        carLicenceSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/car-licences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /car-licences : Updates an existing carLicence.
     *
     * @param carLicence the carLicence to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated carLicence,
     * or with status 400 (Bad Request) if the carLicence is not valid,
     * or with status 500 (Internal Server Error) if the carLicence couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/car-licences")
    @Timed
    public ResponseEntity<CarLicence> updateCarLicence(@RequestBody CarLicence carLicence) throws URISyntaxException {
        log.debug("REST request to update CarLicence : {}", carLicence);
        if (carLicence.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CarLicence result = carLicenceRepository.save(carLicence);
        carLicenceSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, carLicence.getId().toString()))
            .body(result);
    }

    /**
     * GET  /car-licences : get all the carLicences.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of carLicences in body
     */
    @GetMapping("/car-licences")
    @Timed
    public ResponseEntity<List<CarLicence>> getAllCarLicences(Pageable pageable) {
        log.debug("REST request to get a page of CarLicences");
        Page<CarLicence> page = carLicenceRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/car-licences");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /car-licences/:id : get the "id" carLicence.
     *
     * @param id the id of the carLicence to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the carLicence, or with status 404 (Not Found)
     */
    @GetMapping("/car-licences/{id}")
    @Timed
    public ResponseEntity<CarLicence> getCarLicence(@PathVariable Long id) {
        log.debug("REST request to get CarLicence : {}", id);
        Optional<CarLicence> carLicence = carLicenceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(carLicence);
    }

    /**
     * DELETE  /car-licences/:id : delete the "id" carLicence.
     *
     * @param id the id of the carLicence to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/car-licences/{id}")
    @Timed
    public ResponseEntity<Void> deleteCarLicence(@PathVariable Long id) {
        log.debug("REST request to delete CarLicence : {}", id);

        carLicenceRepository.deleteById(id);
        carLicenceSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/car-licences?query=:query : search for the carLicence corresponding
     * to the query.
     *
     * @param query the query of the carLicence search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/car-licences")
    @Timed
    public ResponseEntity<List<CarLicence>> searchCarLicences(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of CarLicences for query {}", query);
        Page<CarLicence> page = carLicenceSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/car-licences");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
