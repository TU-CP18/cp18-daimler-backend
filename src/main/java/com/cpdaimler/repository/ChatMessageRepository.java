package com.cpdaimler.repository;

import com.cpdaimler.domain.ChatMessage;
import com.cpdaimler.domain.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ChatMessage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("select chat_message from ChatMessage chat_message where chat_message.sender.login = ?#{principal.username}")
    List<ChatMessage> findBySenderIsCurrentUser();

    @Query("select chat_message from ChatMessage chat_message where chat_message.recipient.login = ?#{principal.username}")
    List<ChatMessage> findByRecipientIsCurrentUser();

    List<ChatMessage> findTop20ByRecipientOrSenderOrderByIdAsc(User recipient, User sender);

}
