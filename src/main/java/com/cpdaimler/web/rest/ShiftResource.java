package com.cpdaimler.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cpdaimler.domain.Shift;
import com.cpdaimler.service.ShiftService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Shift.
 */
@RestController
@RequestMapping("/api")
public class ShiftResource {

    private final Logger log = LoggerFactory.getLogger(ShiftResource.class);

    private static final String ENTITY_NAME = "shift";

    private ShiftService shiftService;

    public ShiftResource(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    /**
     * POST  /shifts : Create a new shift.
     *
     * @param shift the shift to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shift, or with status 400 (Bad Request) if the shift has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shifts")
    @Timed
    public ResponseEntity<Shift> createShift(@Valid @RequestBody Shift shift) throws URISyntaxException {
        log.debug("REST request to save Shift : {}", shift);
        if (shift.getId() != null) {
            throw new BadRequestAlertException("A new shift cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Shift result = shiftService.save(shift);

        if(result==null) {
            throw new BadRequestAlertException("The car is already used in this time period ", "yihhhaaaaaaaa", "carused");
        }

        return ResponseEntity.created(new URI("/api/shifts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shifts : Updates an existing shift.
     *
     * @param shift the shift to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shift,
     * or with status 400 (Bad Request) if the shift is not valid,
     * or with status 500 (Internal Server Error) if the shift couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shifts")
    @Timed
    public ResponseEntity<Shift> updateShift(@Valid @RequestBody Shift shift) throws URISyntaxException {
        log.debug("REST request to update Shift : {}", shift);
        if (shift.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Shift result = shiftService.save(shift);

        if(result==null) {
            throw new BadRequestAlertException("The car is already used in this time period ", "yihhhaaaaaaaa", "carused");
        }

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shift.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shifts : get all the shifts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of shifts in body
     */
    @GetMapping("/shifts")
    @Timed
    public ResponseEntity<List<Shift>> getAllShifts(Pageable pageable) {
        log.debug("REST request to get a page of Shifts");
        Page<Shift> page = shiftService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/shifts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /shifts : get all full shifts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of shifts in body
     */
    @GetMapping("/shifts/full")
    @Timed
    public ResponseEntity<List<Shift>> getAllFullShifts() {
        log.debug("REST request to get all full Shifts");
        List<Shift> shifts = shiftService.findAllFull();

        return new ResponseEntity<>(shifts, HttpStatus.OK);
    }

        /**
         * GET  /shifts : get all the shifts.
         *
         * @return the ResponseEntity with status 200 (OK) and the list of shifts in body
         */
    @GetMapping("/shifts/parallel/{id}/{start}/{end}")
    @Timed
    public ResponseEntity<List<Shift>> getAllShifts(@PathVariable Long id, @PathVariable Long start, @PathVariable Long end ) {
        log.debug("REST request to get parallel Shifts", id, start, end);
        List<Shift> listShift = shiftService.getParallelShifts(id, start, end);

        return new ResponseEntity<>(listShift, HttpStatus.OK);
    }

    /**
     * GET  /shifts/:id : get the "id" shift.
     *
     * @param id the id of the shift to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shift, or with status 404 (Not Found)
     */
    @GetMapping("/shifts/{id}")
    @Timed
    public ResponseEntity<Shift> getShift(@PathVariable Long id) {
        log.debug("REST request to get Shift : {}", id);
        Optional<Shift> shift = shiftService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shift);
    }

    /**
     * DELETE  /shifts/:id : delete the "id" shift.
     *
     * @param id the id of the shift to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shifts/{id}")
    @Timed
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        log.debug("REST request to delete Shift : {}", id);
        shiftService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/shifts?query=:query : search for the shift corresponding
     * to the query.
     *
     * @param query the query of the shift search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/shifts")
    @Timed
    public ResponseEntity<List<Shift>> searchShifts(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Shifts for query {}", query);
        Page<Shift> page = shiftService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/shifts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    /**
     * GET  /shifts/:id : get the "id" shift.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the shift, or with status 404 (Not Found)
     */
    @GetMapping("/shifts/user/next")
    @Timed
    public ResponseEntity<Shift> getNextShiftForUser() {
        log.debug("REST request to get next Shift");
        Optional<Shift> shift = shiftService.findNextShift();
        return ResponseUtil.wrapOrNotFound(shift);
    }

    /**
     * GET  /shifts/:id : get the "id" shift.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the shift, or with status 404 (Not Found)
     */
    @GetMapping("/shifts/user/all")
    @Timed
    public ResponseEntity<List<Shift>> getAllShiftsForUser() {
        log.debug("REST request to get next Shift");
        List<Shift> shift = shiftService.findAllShiftsForUser();
        return new ResponseEntity<List<Shift>>(shift, HttpStatus.OK);
    }



}
