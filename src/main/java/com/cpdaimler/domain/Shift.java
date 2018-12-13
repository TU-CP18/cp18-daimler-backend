package com.cpdaimler.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Shift.
 */
@Entity
@Table(name = "shift")
@Document(indexName = "shift")
public class Shift implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_start", nullable = false)
    private Long start;

    @NotNull
    @Column(name = "jhi_end", nullable = false)
    private Long end;

    @Column(name = "long_start")
    private Double longStart;

    @Column(name = "lat_start")
    private Double latStart;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Car car;

    @ManyToOne
    @JsonIgnoreProperties("")
    private SafetyDriver safetyDriver;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStart() {
        return start;
    }

    public Shift start(Long start) {
        this.start = start;
        return this;
    }

    public void setStart(Long start) {
        this.start = start;
    }

    public Long getEnd() {
        return end;
    }

    public Shift end(Long end) {
        this.end = end;
        return this;
    }

    public void setEnd(Long end) {
        this.end = end;
    }

    public Double getLongStart() {
        return longStart;
    }

    public Shift longStart(Double longStart) {
        this.longStart = longStart;
        return this;
    }

    public void setLongStart(Double longStart) {
        this.longStart = longStart;
    }

    public Double getLatStart() {
        return latStart;
    }

    public Shift latStart(Double latStart) {
        this.latStart = latStart;
        return this;
    }

    public void setLatStart(Double latStart) {
        this.latStart = latStart;
    }

    public Car getCar() {
        return car;
    }

    public Shift car(Car car) {
        this.car = car;
        return this;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public SafetyDriver getSafetyDriver() {
        return safetyDriver;
    }

    public Shift safetyDriver(SafetyDriver safetyDriver) {
        this.safetyDriver = safetyDriver;
        return this;
    }

    public void setSafetyDriver(SafetyDriver safetyDriver) {
        this.safetyDriver = safetyDriver;
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
        Shift shift = (Shift) o;
        if (shift.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shift.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Shift{" +
            "id=" + getId() +
            ", start=" + getStart() +
            ", end=" + getEnd() +
            ", longStart=" + getLongStart() +
            ", latStart=" + getLatStart() +
            "}";
    }
}
