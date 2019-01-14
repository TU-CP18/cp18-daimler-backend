package com.cpdaimler.repository;

import com.cpdaimler.domain.Car;
import com.cpdaimler.domain.SafetyDriver;
import com.cpdaimler.domain.Shift;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the Shift entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {

    Optional<Shift> findFirstBySafetyDriverAndStartGreaterThanEqualOrderByStartAsc(SafetyDriver safetyDriver, Long start);

    @Query("select f from Shift f where ((f.id <> :id) and ((f.car= :car or f.safetyDriver = :safetyDriver) and ((f.start between :start and :end) or (f.end between :start and :end) or (:start between f.start and f.end) or (:end between f.start and f.end))))")
    List<Shift> findAllByCarOrSafetyDriverAndStartBetweenOrEndBetweenOrStartLessThanEqualAndEndGreaterThanEqual(@Param("id") Long id, @Param("car") Car car, @Param("safetyDriver") SafetyDriver safetyDriver, @Param("start") Long start, @Param("end") Long end);

    @Query("select f from Shift f where ((f.id <> :id) and  ((f.start between :start and :end) or (f.end between :start and :end) or (:start between f.start and f.end) or (:end between f.start and f.end)))")
    List<Shift> findAllParallel(@Param("id") Long id, @Param("start") Long start, @Param("end") Long end);

    List<Shift> findAllBySafetyDriver(SafetyDriver safetyDriver);

}
