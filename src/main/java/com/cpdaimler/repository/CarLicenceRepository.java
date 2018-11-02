package com.cpdaimler.repository;

import com.cpdaimler.domain.CarLicence;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CarLicence entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarLicenceRepository extends JpaRepository<CarLicence, Long> {

}
