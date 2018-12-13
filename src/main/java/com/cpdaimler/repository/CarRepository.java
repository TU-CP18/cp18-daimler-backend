package com.cpdaimler.repository;

import com.cpdaimler.domain.Car;
import com.cpdaimler.domain.enumeration.CARSTATUS;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Car entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findAllByStatus (CARSTATUS carstatus);

}
