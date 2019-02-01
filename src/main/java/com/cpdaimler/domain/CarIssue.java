package com.cpdaimler.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import com.cpdaimler.domain.enumeration.CARISSUESTATUS;

/**
 * A CarIssue.
 */
@Entity
@Table(name = "car_issue")
@Document(indexName = "carissue")
public class CarIssue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "part")
    private String part;

    @Column(name = "pos_x")
    private Double posX;

    @Column(name = "pos_y")
    private Double posY;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CARISSUESTATUS status;

    @ManyToOne
    @JsonIgnoreProperties("issues")
    private Car car;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public CarIssue description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPart() {
        return part;
    }

    public CarIssue part(String part) {
        this.part = part;
        return this;
    }

    public void setPart(String part) {
        this.part = part;
    }

    public Double getPosX() {
        return posX;
    }

    public CarIssue posX(Double posX) {
        this.posX = posX;
        return this;
    }

    public void setPosX(Double posX) {
        this.posX = posX;
    }

    public Double getPosY() {
        return posY;
    }

    public CarIssue posY(Double posY) {
        this.posY = posY;
        return this;
    }

    public void setPosY(Double posY) {
        this.posY = posY;
    }

    public CARISSUESTATUS getStatus() {
        return status;
    }

    public CarIssue status(CARISSUESTATUS status) {
        this.status = status;
        return this;
    }

    public void setStatus(CARISSUESTATUS status) {
        this.status = status;
    }

    public Car getCar() {
        return car;
    }

    public CarIssue car(Car car) {
        this.car = car;
        return this;
    }

    public void setCar(Car car) {
        this.car = car;
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
        CarIssue carIssue = (CarIssue) o;
        if (carIssue.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), carIssue.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CarIssue{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", part='" + getPart() + "'" +
            ", posX=" + getPosX() +
            ", posY=" + getPosY() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
