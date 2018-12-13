package com.cpdaimler.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cpdaimler.domain.SafetyDriver;
import com.cpdaimler.service.MailService;
import com.cpdaimler.service.SafetyDriverService;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SafetyDriver.
 */
@RestController
@RequestMapping("/api")
public class SafetyDriverResource {

    private final Logger log = LoggerFactory.getLogger(SafetyDriverResource.class);

    private static final String ENTITY_NAME = "safetyDriver";

    private SafetyDriverService safetyDriverService;

    private MailService mailService;

    public SafetyDriverResource(SafetyDriverService safetyDriverService, MailService mailService) {
        this.safetyDriverService = safetyDriverService;
        this.mailService=mailService;
    }

    /**
     * POST  /safety-drivers : Create a new safetyDriver.
     *
     * @param safetyDriver the safetyDriver to create
     * @return the ResponseEntity with status 201 (Created) and with body the new safetyDriver, or with status 400 (Bad Request) if the safetyDriver has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/safety-drivers")
    @Timed
    public ResponseEntity<SafetyDriver> createSafetyDriver(@Valid @RequestBody SafetyDriver safetyDriver) throws URISyntaxException {
        log.debug("REST request to save SafetyDriver : {}", safetyDriver);
        if (safetyDriver.getId() != null) {
            throw new BadRequestAlertException("A new safetyDriver cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SafetyDriver result = safetyDriverService.register(safetyDriver);
        mailService.sendCreationEmail(result.getUser());
        return ResponseEntity.created(new URI("/api/safety-drivers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }



    /**
     * PUT  /safety-drivers : Updates an existing safetyDriver.
     *
     * @param safetyDriver the safetyDriver to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated safetyDriver,
     * or with status 400 (Bad Request) if the safetyDriver is not valid,
     * or with status 500 (Internal Server Error) if the safetyDriver couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/safety-drivers")
    @Timed
    public ResponseEntity<SafetyDriver> updateSafetyDriver(@Valid @RequestBody SafetyDriver safetyDriver) throws URISyntaxException {
        log.debug("REST request to update SafetyDriver : {}", safetyDriver);
        if (safetyDriver.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SafetyDriver result = safetyDriverService.save(safetyDriver);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, safetyDriver.getId().toString()))
            .body(result);
    }

    /**
     * GET  /safety-drivers : get all the safetyDrivers.
     *
     * @param pageable the pagination information
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of safetyDrivers in body
     */
    @GetMapping("/safety-drivers")
    @Timed
    public ResponseEntity<List<SafetyDriver>> getAllSafetyDrivers(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of SafetyDrivers");
        Page<SafetyDriver> page;
        if (eagerload) {
            page = safetyDriverService.findAllWithEagerRelationships(pageable);
        } else {
            page = safetyDriverService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, String.format("/api/safety-drivers?eagerload=%b", eagerload));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /safety-drivers/:id : get the "id" safetyDriver.
     *
     * @param id the id of the safetyDriver to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the safetyDriver, or with status 404 (Not Found)
     */
    @GetMapping("/safety-drivers/{id}")
    @Timed
    public ResponseEntity<SafetyDriver> getSafetyDriver(@PathVariable Long id) {
        log.debug("REST request to get SafetyDriver : {}", id);
        Optional<SafetyDriver> safetyDriver = safetyDriverService.findOne(id);
        return ResponseUtil.wrapOrNotFound(safetyDriver);
    }

    /**
     * DELETE  /safety-drivers/:id : delete the "id" safetyDriver.
     *
     * @param id the id of the safetyDriver to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/safety-drivers/{id}")
    @Timed
    public ResponseEntity<Void> deleteSafetyDriver(@PathVariable Long id) {
        log.debug("REST request to delete SafetyDriver : {}", id);


        safetyDriverService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/safety-drivers?query=:query : search for the safetyDriver corresponding
     * to the query.
     *
     * @param query the query of the safetyDriver search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/safety-drivers")
    @Timed
    public ResponseEntity<List<SafetyDriver>> searchSafetyDrivers(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of SafetyDrivers for query {}", query);
        Page<SafetyDriver> page = safetyDriverService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/safety-drivers");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
