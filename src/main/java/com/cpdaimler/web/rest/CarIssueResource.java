package com.cpdaimler.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cpdaimler.domain.CarIssue;
import com.cpdaimler.service.CarIssueService;
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
 * REST controller for managing CarIssue.
 */
@RestController
@RequestMapping("/api")
public class CarIssueResource {

    private final Logger log = LoggerFactory.getLogger(CarIssueResource.class);

    private static final String ENTITY_NAME = "carIssue";

    private CarIssueService carIssueService;

    public CarIssueResource(CarIssueService carIssueService) {
        this.carIssueService = carIssueService;
    }

    /**
     * PUT  /car-issues : Updates an existing carIssue.
     *
     * @param carIssue the carIssue to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated carIssue,
     * or with status 400 (Bad Request) if the carIssue is not valid,
     * or with status 500 (Internal Server Error) if the carIssue couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/car-issues")
    @Timed
    public ResponseEntity<CarIssue> updateCarIssue(@RequestBody CarIssue carIssue) throws URISyntaxException {
        log.debug("REST request to update CarIssue : {}", carIssue);
        if (carIssue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CarIssue result = carIssueService.save(carIssue);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, carIssue.getId().toString()))
            .body(result);
    }

    /**
     * GET  /car-issues : get all the carIssues.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of carIssues in body
     */
    @GetMapping("/car-issues")
    @Timed
    public ResponseEntity<List<CarIssue>> getAllCarIssues(Pageable pageable) {
        log.debug("REST request to get a page of CarIssues");
        Page<CarIssue> page = carIssueService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/car-issues");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /car-issues/:id : get the "id" carIssue.
     *
     * @param id the id of the carIssue to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the carIssue, or with status 404 (Not Found)
     */
    @GetMapping("/car-issues/{id}")
    @Timed
    public ResponseEntity<CarIssue> getCarIssue(@PathVariable Long id) {
        log.debug("REST request to get CarIssue : {}", id);
        Optional<CarIssue> carIssue = carIssueService.findOne(id);
        return ResponseUtil.wrapOrNotFound(carIssue);
    }

    /**
     * DELETE  /car-issues/:id : delete the "id" carIssue.
     *
     * @param id the id of the carIssue to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/car-issues/{id}")
    @Timed
    public ResponseEntity<Void> deleteCarIssue(@PathVariable Long id) {
        log.debug("REST request to delete CarIssue : {}", id);
        carIssueService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/car-issues?query=:query : search for the carIssue corresponding
     * to the query.
     *
     * @param query the query of the carIssue search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/car-issues")
    @Timed
    public ResponseEntity<List<CarIssue>> searchCarIssues(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of CarIssues for query {}", query);
        Page<CarIssue> page = carIssueService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/car-issues");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
