package com.cpdaimler.service.dto;

import com.cpdaimler.domain.enumeration.CARSTATUS;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.ArrayList;
import java.util.List;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class CarStatisticsDTO {

    @JsonIgnoreProperties("")
    List<CarStatisticsEntry> entries;

    public CarStatisticsDTO() {
        this.entries = new ArrayList<>();
    }

    public List<CarStatisticsEntry> getEntries() {
        return entries;
    }

    public void addEntry(CARSTATUS carstatus, int number) {
        getEntries().add(new CarStatisticsEntry(carstatus, number));
    }

}
