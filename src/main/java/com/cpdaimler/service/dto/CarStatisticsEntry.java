package com.cpdaimler.service.dto;

import com.cpdaimler.domain.enumeration.CARSTATUS;

public class CarStatisticsEntry {

    private CARSTATUS carstatus;

    private int number;

    public CarStatisticsEntry() {
    }

    public CarStatisticsEntry(CARSTATUS carstatus, int number) {
        this.carstatus = carstatus;
        this.number = number;
    }

    public CARSTATUS getCarstatus() {
        return carstatus;
    }

    public void setCarstatus(CARSTATUS carstatus) {
        this.carstatus = carstatus;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}
