package com.cpdaimler.service;

import com.cpdaimler.domain.ChatMessage;
import com.cpdaimler.domain.User;
import com.cpdaimler.repository.ChatMessageRepository;
import com.cpdaimler.repository.UserRepository;
import com.cpdaimler.repository.search.ChatMessageSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing ChatMessage.
 */
@Service
@Transactional
public class ChatMessageService {

    private final Logger log = LoggerFactory.getLogger(ChatMessageService.class);

    private ChatMessageRepository chatMessageRepository;

    private ChatMessageSearchRepository chatMessageSearchRepository;

    private UserRepository userRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository, ChatMessageSearchRepository chatMessageSearchRepository, UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatMessageSearchRepository = chatMessageSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a chatMessage.
     *
     * @param chatMessage the entity to save
     * @return the persisted entity
     */
    public ChatMessage save(ChatMessage chatMessage) {
        log.debug("Request to save ChatMessage : {}", chatMessage);
        ChatMessage result = chatMessageRepository.save(chatMessage);
        chatMessageSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the chatMessages.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ChatMessage> findAll(Pageable pageable) {
        log.debug("Request to get all ChatMessages");
        return chatMessageRepository.findAll(pageable);
    }


    /**
     * Get one chatMessage by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<ChatMessage> findOne(Long id) {
        log.debug("Request to get ChatMessage : {}", id);
        return chatMessageRepository.findById(id);
    }

    /**
     * Get chatMessage history by user id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getHistory(Long id) {
        log.debug("Request to get Chat History : {}", id);
        User user = userRepository.findById(id).get();
        return chatMessageRepository.findTop20ByRecipientOrSenderOrderByIdAsc(user, user);
    }

    /**
     * Delete the chatMessage by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete ChatMessage : {}", id);
        chatMessageRepository.deleteById(id);
        chatMessageSearchRepository.deleteById(id);
    }

    /**
     * Search for the chatMessage corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ChatMessage> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ChatMessages for query {}", query);
        return chatMessageSearchRepository.search(queryStringQuery(query), pageable);    }
}
