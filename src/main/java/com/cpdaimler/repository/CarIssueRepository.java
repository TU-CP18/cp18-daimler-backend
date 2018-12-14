package com.cpdaimler.repository;

import com.cpdaimler.domain.CarIssue;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CarIssue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarIssueRepository extends JpaRepository<CarIssue, Long> {

}
