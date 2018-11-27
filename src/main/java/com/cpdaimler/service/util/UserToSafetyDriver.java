package com.cpdaimler.service.util;


import com.cpdaimler.domain.SafetyDriver;
import com.cpdaimler.domain.User;
import com.cpdaimler.repository.SafetyDriverRepository;
import com.cpdaimler.repository.UserRepository;
import com.cpdaimler.security.SecurityUtils;
import com.cpdaimler.web.rest.errors.InternalServerErrorException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserToSafetyDriver {

    private final SafetyDriverRepository safetyDriverRepository;

    private final UserRepository userRepository;

    public UserToSafetyDriver(UserRepository userRepository, SafetyDriverRepository safetyDriverRepository) {
        this.safetyDriverRepository=safetyDriverRepository;
        this.userRepository=userRepository;
    }

    public  Optional<SafetyDriver> getCustomerForUser() {
        final String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new InternalServerErrorException("Current user login not found"));


        Optional<User> user = userRepository.findOneByLogin(userLogin);
        if (!user.isPresent()) {
            throw new InternalServerErrorException("User could not be found");
        }

        Optional<SafetyDriver> customer = safetyDriverRepository.findByLogin(user.get().getLogin());
        if (!customer.isPresent()) {
            throw new InternalServerErrorException("User could not be found");
        }
        return customer;
    }
}
