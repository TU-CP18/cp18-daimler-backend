package com.cpdaimler.repository;

import com.cpdaimler.domain.SafetyDriver;
import com.cpdaimler.domain.Shift;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;


/**
 * Spring Data  repository for the Shift entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {

    Optional<Shift> findOneBySafetyDriver(SafetyDriver safetyDriver);
}
