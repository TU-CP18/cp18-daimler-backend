package com.cpdaimler.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A ChatMessage.
 */
@Entity
@Table(name = "chat_message")
@Document(indexName = "chatmessage")
public class ChatMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text")
    private String text;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User sender;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User recipient;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public ChatMessage text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public ChatMessage createdAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getSender() {
        return sender;
    }

    public ChatMessage sender(User user) {
        this.sender = user;
        return this;
    }

    public void setSender(User user) {
        this.sender = user;
    }

    public User getRecipient() {
        return recipient;
    }

    public ChatMessage recipient(User user) {
        this.recipient = user;
        return this;
    }

    public void setRecipient(User user) {
        this.recipient = user;
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
        ChatMessage chatMessage = (ChatMessage) o;
        if (chatMessage.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), chatMessage.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
