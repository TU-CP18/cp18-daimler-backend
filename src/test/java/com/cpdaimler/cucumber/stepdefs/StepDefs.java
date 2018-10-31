package com.cpdaimler.cucumber.stepdefs;

import com.cpdaimler.CpdaimlerApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = CpdaimlerApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
