package com.cpdaimler.domain;


import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import com.cpdaimler.domain.enumeration.LICENCE;

/**
 * A CarLicence.
 */
@Entity
@Table(name = "car_licence")
@Document(indexName = "carlicence")
public class CarLicence implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "car_licence")
    private LICENCE carLicence;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LICENCE getCarLicence() {
        return carLicence;
    }

    public CarLicence carLicence(LICENCE carLicence) {
        this.carLicence = carLicence;
        return this;
    }

    public void setCarLicence(LICENCE carLicence) {
        this.carLicence = carLicence;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CarLicence carLicence = (CarLicence) o;
        if (carLicence.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), carLicence.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CarLicence{" +
            "id=" + getId() +
            ", carLicence='" + getCarLicence() + "'" +
            "}";
    }
}
