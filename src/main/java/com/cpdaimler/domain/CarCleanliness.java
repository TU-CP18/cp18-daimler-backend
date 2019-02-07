package com.cpdaimler.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A CarCleanliness.
 */
@Entity
@Table(name = "car_cleanliness")
@Document(indexName = "carcleanliness")
public class CarCleanliness implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "event")
    private String event;

    @Column(name = "part")
    private String part;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Car car;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Shift shift;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getRating() {
        return rating;
    }

    public CarCleanliness rating(Double rating) {
        this.rating = rating;
        return this;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getEvent() {
        return event;
    }

    public CarCleanliness event(String event) {
        this.event = event;
        return this;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getPart() {
        return part;
    }

    public CarCleanliness part(String part) {
        this.part = part;
        return this;
    }

    public void setPart(String part) {
        this.part = part;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public CarCleanliness createdAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Car getCar() {
        return car;
    }

    public CarCleanliness car(Car car) {
        this.car = car;
        return this;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public Shift getShift() {
        return shift;
    }

    public CarCleanliness shift(Shift shift) {
        this.shift = shift;
        return this;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
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
        CarCleanliness carCleanliness = (CarCleanliness) o;
        if (carCleanliness.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), carCleanliness.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CarCleanliness{" +
            "id=" + getId() +
            ", rating=" + getRating() +
            ", event='" + getEvent() + "'" +
            ", part='" + getPart() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
