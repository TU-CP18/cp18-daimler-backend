package com.cpdaimler.repository;

import com.cpdaimler.domain.CarCleanliness;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CarCleanliness entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarCleanlinessRepository extends JpaRepository<CarCleanliness, Long> {

}
