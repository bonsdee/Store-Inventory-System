package com.inventory.system.dto;

public class DashboardResponse {

    private long totalProducts;

    private int totalStock;

    private long lowStockProducts;

    private long recentTransactions;

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(int totalStock) {
        this.totalStock = totalStock;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public long getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(long recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}