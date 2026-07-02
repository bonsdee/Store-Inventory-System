package com.inventory.system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.inventory.system.entity.StockTransaction;

public interface StockTransactionRepository
        extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByProductId(Long productId);

    // Sales per day (Stock OUT)
    @Query("""
        SELECT DATE(s.createdAt), SUM(s.quantity)
        FROM StockTransaction s
        WHERE s.type = 'OUT'
        GROUP BY DATE(s.createdAt)
        ORDER BY DATE(s.createdAt)
    """)
    List<Object[]> getDailySales();
}