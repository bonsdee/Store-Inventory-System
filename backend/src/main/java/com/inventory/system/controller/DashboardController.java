package com.inventory.system.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.system.dto.DailySalesDTO;
import com.inventory.system.dto.DashboardResponse;
import com.inventory.system.entity.Product;
import com.inventory.system.repository.ProductRepository;
import com.inventory.system.repository.StockTransactionRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final ProductRepository productRepository;
    private final StockTransactionRepository stockRepository;

    public DashboardController(
            ProductRepository productRepository,
            StockTransactionRepository stockRepository) {

        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    @GetMapping
    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        // Total Products
        response.setTotalProducts(productRepository.count());

        // Total Stock
        List<Product> products = productRepository.findAll();

        int totalStock = products.stream()
                .mapToInt(Product::getQuantity)
                .sum();

        response.setTotalStock(totalStock);

        // Low Stock Products
        response.setLowStockProducts(
                productRepository.countByQuantityLessThan(10));

        // Total Transactions
        response.setRecentTransactions(
                stockRepository.count());

        return response;
    }

    // ============================
    // NEW: Sales Per Day Endpoint
    // ============================

    @GetMapping("/sales/daily")
    public List<DailySalesDTO> getDailySales() {

        List<Object[]> results = stockRepository.getDailySales();

        List<DailySalesDTO> sales = new ArrayList<>();

        for (Object[] row : results) {

            sales.add(new DailySalesDTO(
                    row[0].toString(),
                    ((Number) row[1]).longValue()));
        }

        return sales;
    }

}