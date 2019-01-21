package com.cpdaimler.service.dto;

public class SDriverEntry {

    String type;

    Long number;

    public SDriverEntry() {
    }

    public SDriverEntry(String type, Long number) {
        this.type = type;
        this.number = number;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }
}
