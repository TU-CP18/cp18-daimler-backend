package com.cpdaimler.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cpdaimler.domain.ChatMessage;
import com.cpdaimler.service.ChatMessageService;
import com.cpdaimler.web.rest.errors.BadRequestAlertException;
import com.cpdaimler.web.rest.util.HeaderUtil;
import com.cpdaimler.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing ChatMessage.
 */
@RestController
@RequestMapping("/api")
public class ChatMessageResource {

    private final Logger log = LoggerFactory.getLogger(ChatMessageResource.class);

    private static final String ENTITY_NAME = "chatMessage";

    private ChatMessageService chatMessageService;

    public ChatMessageResource(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    /**
     * POST  /chat-messages : Create a new chatMessage.
     *
     * @param chatMessage the chatMessage to create
     * @return the ResponseEntity with status 201 (Created) and with body the new chatMessage, or with status 400 (Bad Request) if the chatMessage has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/chat-messages")
    @Timed
    public ResponseEntity<ChatMessage> createChatMessage(@RequestBody ChatMessage chatMessage) throws URISyntaxException {
        log.debug("REST request to save ChatMessage : {}", chatMessage);
        if (chatMessage.getId() != null) {
            throw new BadRequestAlertException("A new chatMessage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChatMessage result = chatMessageService.save(chatMessage);
        return ResponseEntity.created(new URI("/api/chat-messages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /chat-messages : Updates an existing chatMessage.
     *
     * @param chatMessage the chatMessage to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated chatMessage,
     * or with status 400 (Bad Request) if the chatMessage is not valid,
     * or with status 500 (Internal Server Error) if the chatMessage couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/chat-messages")
    @Timed
    public ResponseEntity<ChatMessage> updateChatMessage(@RequestBody ChatMessage chatMessage) throws URISyntaxException {
        log.debug("REST request to update ChatMessage : {}", chatMessage);
        if (chatMessage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ChatMessage result = chatMessageService.save(chatMessage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, chatMessage.getId().toString()))
            .body(result);
    }

    /**
     * GET  /chat-messages : get all the chatMessages.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of chatMessages in body
     */
    @GetMapping("/chat-messages")
    @Timed
    public ResponseEntity<List<ChatMessage>> getAllChatMessages(Pageable pageable) {
        log.debug("REST request to get a page of ChatMessages");
        Page<ChatMessage> page = chatMessageService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/chat-messages");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /chat-messages/:id : get the "id" chatMessage.
     *
     * @param id the id of the chatMessage to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the chatMessage, or with status 404 (Not Found)
     */
    @GetMapping("/chat-messages/{id}")
    @Timed
    public ResponseEntity<ChatMessage> getChatMessage(@PathVariable Long id) {
        log.debug("REST request to get ChatMessage : {}", id);
        Optional<ChatMessage> chatMessage = chatMessageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chatMessage);
    }

    /**
     * GET  /chat-messages/history/:id : get chatMessage history of user "id".
     *
     * @param id the id of the user for which you want to receive the chatMessage history
     * @return the ResponseEntity with status 200 (OK) and with body the chatMessage history, or with status 404 (Not Found)
     */
    @GetMapping("/chat-messages/history/{id}")
    @Timed
    public List<ChatMessage> getChatMessageHistory(@PathVariable Long id) {
        log.debug("REST request to get ChatMessage history of user: {}", id);
        List<ChatMessage> chatHistory = chatMessageService.getHistory(id);
        return chatHistory;
    }

    /**
     * DELETE  /chat-messages/:id : delete the "id" chatMessage.
     *
     * @param id the id of the chatMessage to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/chat-messages/{id}")
    @Timed
    public ResponseEntity<Void> deleteChatMessage(@PathVariable Long id) {
        log.debug("REST request to delete ChatMessage : {}", id);
        chatMessageService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/chat-messages?query=:query : search for the chatMessage corresponding
     * to the query.
     *
     * @param query the query of the chatMessage search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/chat-messages")
    @Timed
    public ResponseEntity<List<ChatMessage>> searchChatMessages(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ChatMessages for query {}", query);
        Page<ChatMessage> page = chatMessageService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/chat-messages");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
