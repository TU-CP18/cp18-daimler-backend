package com.cpdaimler.service.dto;

import java.util.ArrayList;
import java.util.List;

public class SDriverStatisticsDTO {

    private List<SDriverEntry> entries;

    public SDriverStatisticsDTO() {
        this.entries = new ArrayList<>();
    }

    public List<SDriverEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<SDriverEntry> entries) {
        this.entries = entries;
    }

    public void addEntry(String type, Long number) {
        this.getEntries().add(new SDriverEntry(type, number));
    }
}
