package com.cpdaimler.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import com.cpdaimler.domain.enumeration.CARSTATUS;

/**
 * A Car.
 */
@Entity
@Table(name = "car")
@Document(indexName = "car")
public class Car implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model")
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CARSTATUS status;

    @ManyToOne
    @JsonIgnoreProperties("")
    private CarLicence licence;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public Car model(String model) {
        this.model = model;
        return this;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public CARSTATUS getStatus() {
        return status;
    }

    public Car status(CARSTATUS status) {
        this.status = status;
        return this;
    }

    public void setStatus(CARSTATUS status) {
        this.status = status;
    }

    public CarLicence getLicence() {
        return licence;
    }

    public Car licence(CarLicence carLicence) {
        this.licence = carLicence;
        return this;
    }

    public void setLicence(CarLicence carLicence) {
        this.licence = carLicence;
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
        Car car = (Car) o;
        if (car.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), car.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Car{" +
            "id=" + getId() +
            ", model='" + getModel() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
