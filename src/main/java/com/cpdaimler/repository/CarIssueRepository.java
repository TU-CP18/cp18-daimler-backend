package com.cpdaimler.repository;

import com.cpdaimler.domain.Car;
import com.cpdaimler.domain.CarIssue;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the CarIssue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarIssueRepository extends JpaRepository<CarIssue, Long> {


    public List<CarIssue> findAllByCar(Car car);
}
