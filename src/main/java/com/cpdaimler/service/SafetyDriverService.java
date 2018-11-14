package com.cpdaimler.service;

import com.cpdaimler.domain.SafetyDriver;
import com.cpdaimler.domain.User;
import com.cpdaimler.repository.SafetyDriverRepository;
import com.cpdaimler.repository.UserRepository;
import com.cpdaimler.repository.search.SafetyDriverSearchRepository;
import com.cpdaimler.service.dto.UserDTO;
import io.undertow.util.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing SafetyDriver.
 */
@Service
@Transactional
public class SafetyDriverService {

    private final Logger log = LoggerFactory.getLogger(SafetyDriverService.class);

    private SafetyDriverRepository safetyDriverRepository;

    private SafetyDriverSearchRepository safetyDriverSearchRepository;

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    private UserRepository userRepository;

    public SafetyDriverService(SafetyDriverRepository safetyDriverRepository, UserService userService , PasswordEncoder passwordEncoder, SafetyDriverSearchRepository safetyDriverSearchRepository, UserRepository userRepository) {
        this.safetyDriverRepository = safetyDriverRepository;
        this.safetyDriverSearchRepository = safetyDriverSearchRepository;
        this.userService=userService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    /**
     * Save a safetyDriver.
     *
     * @param safetyDriver the entity to save
     * @return the persisted entity
     */
    public SafetyDriver save(SafetyDriver safetyDriver) {
        log.debug("Request to save SafetyDriver : {}", safetyDriver);

        SafetyDriver result = safetyDriverRepository.save(safetyDriver);
        safetyDriverSearchRepository.save(result);

        Optional<User> userOpt= userRepository.findOneByLogin(safetyDriver.getLogin());

        if(!userOpt.isPresent()) {
            try {
                throw new BadRequestException();
            } catch (BadRequestException e) {
                e.printStackTrace();
            }
        }

        User u = userOpt.get();

        u.setLogin(safetyDriver.getLogin());
        u.setEmail(safetyDriver.getUser().getEmail());
        u.setFirstName(safetyDriver.getUser().getFirstName());
        u.setLastName(safetyDriver.getUser().getLastName());

        userRepository.save(u);

        return result;

    }

    public SafetyDriver register(SafetyDriver safetyDriver) {
        log.debug("Request to save SafetyDriver : {}", safetyDriver);


        safetyDriver.getUser().setLogin(safetyDriver.getLogin());
        UserDTO userDTO = new UserDTO(safetyDriver.getUser());

        User u= userService.registerUser(userDTO,("abcd"));
        safetyDriver.setUser(u);
        SafetyDriver result = safetyDriverRepository.save(safetyDriver);
        safetyDriverSearchRepository.save(result);
        return result;

    }

    /**
     * Get all the safetyDrivers.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<SafetyDriver> findAll(Pageable pageable) {
        log.debug("Request to get all SafetyDrivers");
        return safetyDriverRepository.findAll(pageable);
    }

    /**
     * Get all the SafetyDriver with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<SafetyDriver> findAllWithEagerRelationships(Pageable pageable) {
        return safetyDriverRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one safetyDriver by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<SafetyDriver> findOne(Long id) {
        log.debug("Request to get SafetyDriver : {}", id);
        return safetyDriverRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the safetyDriver by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete SafetyDriver : {}", id);
        safetyDriverRepository.deleteById(id);
        safetyDriverSearchRepository.deleteById(id);
    }

    /**
     * Search for the safetyDriver corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<SafetyDriver> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of SafetyDrivers for query {}", query);
        return safetyDriverSearchRepository.search(queryStringQuery(query), pageable);    }
}
