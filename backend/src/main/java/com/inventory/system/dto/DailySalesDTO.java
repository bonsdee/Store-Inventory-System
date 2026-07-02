package com.inventory.system.dto;

public class DailySalesDTO {

    private String date;
    private Long sales;

    public DailySalesDTO(String date, Long sales) {
        this.date = date;
        this.sales = sales;
    }

    public String getDate() {
        return date;
    }

    public Long getSales() {
        return sales;
    }
}

