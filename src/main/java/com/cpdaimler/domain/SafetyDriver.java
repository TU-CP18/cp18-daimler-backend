package com.cpdaimler.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A SafetyDriver.
 */
@Entity
@Table(name = "safety_driver")
@Document(indexName = "safetydriver")
public class SafetyDriver implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "login", nullable = false)
    private String login;

    @OneToOne    @JoinColumn(unique = true)
    private User user;

    @ManyToMany
    @JoinTable(name = "safety_driver_licences",
               joinColumns = @JoinColumn(name = "safety_drivers_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "licences_id", referencedColumnName = "id"))
    private Set<CarLicence> licences = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public SafetyDriver login(String login) {
        this.login = login;
        return this;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public User getUser() {
        return user;
    }

    public SafetyDriver user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<CarLicence> getLicences() {
        return licences;
    }

    public SafetyDriver licences(Set<CarLicence> carLicences) {
        this.licences = carLicences;
        return this;
    }

    public SafetyDriver addLicences(CarLicence carLicence) {
        this.licences.add(carLicence);
        return this;
    }

    public SafetyDriver removeLicences(CarLicence carLicence) {
        this.licences.remove(carLicence);
        return this;
    }

    public void setLicences(Set<CarLicence> carLicences) {
        this.licences = carLicences;
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
        SafetyDriver safetyDriver = (SafetyDriver) o;
        if (safetyDriver.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), safetyDriver.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SafetyDriver{" +
            "id=" + getId() +
            ", login='" + getLogin() + "'" +
            "}";
    }
}
