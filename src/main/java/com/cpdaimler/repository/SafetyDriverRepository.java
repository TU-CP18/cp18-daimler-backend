package com.cpdaimler.repository;

import com.cpdaimler.domain.SafetyDriver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the SafetyDriver entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SafetyDriverRepository extends JpaRepository<SafetyDriver, Long> {

    @Query(value = "select distinct safety_driver from SafetyDriver safety_driver left join fetch safety_driver.licences",
        countQuery = "select count(distinct safety_driver) from SafetyDriver safety_driver")
    Page<SafetyDriver> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct safety_driver from SafetyDriver safety_driver left join fetch safety_driver.licences")
    List<SafetyDriver> findAllWithEagerRelationships();

    @Query("select safety_driver from SafetyDriver safety_driver left join fetch safety_driver.licences where safety_driver.id =:id")
    Optional<SafetyDriver> findOneWithEagerRelationships(@Param("id") Long id);

    Optional<SafetyDriver> findByLogin(String login);

}
